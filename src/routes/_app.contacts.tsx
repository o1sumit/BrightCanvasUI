import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import {
  Plus, Search, Upload, Mail, Phone, Users, Edit2, Trash2,
  Folder, AlertCircle, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput, ThemedSelect } from "@/components/ui-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useScopedList, useWorkspace } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — Tunis Agent Ai" }] }),
  component: ContactsPage,
});

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  enabled: boolean;
}

export interface ContactGroup {
  id: string;
  name: string;
  enabled: boolean;
  contacts: Contact[];
}

const defaultGroups: ContactGroup[] = [
  {
    id: "g-1",
    name: "Summer Leads 2026",
    enabled: true,
    contacts: [
      { id: "c-1", name: "Alice Smith", phone: "+1 (555) 0100", email: "alice@example.com", notes: "Interested in Enterprise plan.", enabled: true },
      { id: "c-2", name: "Bob Jones", phone: "+1 (555) 0101", email: "bob@example.com", notes: "Requested follow-up call in July.", enabled: true },
      { id: "c-3", name: "Charlie Brown", phone: "+1 (555) 0102", email: "charlie@example.com", notes: "Prefers email communications.", enabled: false },
    ],
  },
  {
    id: "g-2",
    name: "Renewal Cohort Q3",
    enabled: true,
    contacts: [
      { id: "c-4", name: "David Miller", phone: "+1 (555) 0200", email: "david@example.com", notes: "Needs contract review by agent.", enabled: true },
      { id: "c-5", name: "Eva Green", phone: "+1 (555) 0201", email: "eva@example.com", notes: "Ask about multi-year discount.", enabled: true },
    ],
  },
  {
    id: "g-3",
    name: "Cold Outreach",
    enabled: false,
    contacts: [
      { id: "c-6", name: "Frank White", phone: "+1 (555) 0300", email: "frank@example.com", notes: "No response to first email.", enabled: true },
    ],
  },
];

function Switch({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors shrink-0 outline-none cursor-pointer",
        checked && !disabled ? "bg-mint" : "bg-muted",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span className={cn(
        "absolute top-0.5 size-5 rounded-full bg-white shadow-card transition-all",
        checked ? "left-[22px]" : "left-0.5",
      )} />
    </button>
  );
}

function parseCSV(text: string): Omit<Contact, "id" | "enabled">[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length === 0) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(val => val.replace(/^"|"$/g, ""));
  };

  const headerCells = parseLine(lines[0]);
  let nameIdx = -1;
  let phoneIdx = -1;
  let emailIdx = -1;
  let notesIdx = -1;

  headerCells.forEach((cell, idx) => {
    const lower = cell.toLowerCase();
    if (lower.includes("name")) nameIdx = idx;
    else if (lower.includes("phone") || lower.includes("tel") || lower.includes("number")) phoneIdx = idx;
    else if (lower.includes("email") || lower.includes("mail")) emailIdx = idx;
    else if (lower.includes("note") || lower.includes("comment") || lower.includes("desc")) notesIdx = idx;
  });

  if (nameIdx === -1) nameIdx = 0;
  if (phoneIdx === -1) phoneIdx = headerCells.length > 1 ? 1 : 0;
  if (emailIdx === -1) emailIdx = headerCells.length > 2 ? 2 : 0;
  if (notesIdx === -1) notesIdx = headerCells.length > 3 ? 3 : 0;

  const contactsList: Omit<Contact, "id" | "enabled">[] = [];
  const firstCell = headerCells[nameIdx]?.toLowerCase() || "";
  const startIdx = (firstCell.includes("name") || headerCells[emailIdx]?.toLowerCase().includes("email")) ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    if (cells.length === 0 || !cells[nameIdx]) continue;
    contactsList.push({
      name: cells[nameIdx] || "",
      phone: cells[phoneIdx] || "",
      email: cells[emailIdx] || "",
      notes: cells[notesIdx] || "",
    });
  }
  return contactsList;
}

function ContactsPage() {
  const { workspace } = useWorkspace();
  const [groups, setGroups] = useScopedList<ContactGroup>("contactGroups", defaultGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(() => groups[0]?.id || null);
  const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId) || null, [groups, selectedGroupId]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<"create" | "rename">("create");
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  const [groupNameInput, setGroupNameInput] = useState("");

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalMode, setContactModalMode] = useState<"create" | "edit">("create");
  const [targetContactId, setTargetContactId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [csvTargetMode, setCsvTargetMode] = useState<"new" | "existing">("new");
  const [csvNewGroupName, setCsvNewGroupName] = useState("");
  const [csvExistingGroupId, setCsvExistingGroupId] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalContactsCount = useMemo(() => groups.reduce((acc, g) => acc + g.contacts.length, 0), [groups]);
  const totalActiveContactsCount = useMemo(() => groups.reduce((acc, g) => {
    if (!g.enabled) return acc;
    return acc + g.contacts.filter(c => c.enabled).length;
  }, 0), [groups]);
  const activeGroupsCount = useMemo(() => groups.filter(g => g.enabled).length, [groups]);

  // Selected group contacts filtered
  const filteredContacts = useMemo(() => {
    if (!selectedGroup) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return selectedGroup.contacts;
    return selectedGroup.contacts.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.notes.toLowerCase().includes(query)
    );
  }, [selectedGroup, searchQuery]);

  // Group Handlers
  const handleOpenCreateGroup = () => {
    setGroupModalMode("create");
    setGroupNameInput("");
    setGroupModalOpen(true);
  };

  const handleOpenRenameGroup = (e: React.MouseEvent, g: ContactGroup) => {
    e.stopPropagation();
    setGroupModalMode("rename");
    setTargetGroupId(g.id);
    setGroupNameInput(g.name);
    setGroupModalOpen(true);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupNameInput.trim()) return;

    if (groupModalMode === "create") {
      const newId = `g-${Date.now()}`;
      const newGroup: ContactGroup = {
        id: newId,
        name: groupNameInput.trim(),
        enabled: true,
        contacts: [],
      };
      const updated = [...groups, newGroup];
      setGroups(updated);
      setSelectedGroupId(newId);
    } else {
      const updated = groups.map(g => g.id === targetGroupId ? { ...g, name: groupNameInput.trim() } : g);
      setGroups(updated);
    }
    setGroupModalOpen(false);
  };

  const handleDeleteGroup = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this group? All contacts inside it will be permanently deleted.")) {
      const updated = groups.filter(g => g.id !== id);
      setGroups(updated);
      if (selectedGroupId === id) {
        setSelectedGroupId(updated[0]?.id || null);
      }
    }
  };

  const handleToggleGroup = (id: string, checked: boolean) => {
    const updated = groups.map(g => g.id === id ? { ...g, enabled: checked } : g);
    setGroups(updated);
  };

  // Contact Handlers
  const handleOpenCreateContact = () => {
    setContactModalMode("create");
    setContactForm({ name: "", phone: "", email: "", notes: "" });
    setContactModalOpen(true);
  };

  const handleOpenEditContact = (c: Contact) => {
    setContactModalMode("edit");
    setTargetContactId(c.id);
    setContactForm({ name: c.name, phone: c.phone, email: c.email, notes: c.notes });
    setContactModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) return;

    if (contactModalMode === "create") {
      const newContact: Contact = {
        id: `c-${Date.now()}`,
        name: contactForm.name.trim(),
        phone: contactForm.phone.trim(),
        email: contactForm.email.trim(),
        notes: contactForm.notes.trim(),
        enabled: true,
      };
      const updated = groups.map(g => {
        if (g.id === selectedGroupId) {
          return { ...g, contacts: [...g.contacts, newContact] };
        }
        return g;
      });
      setGroups(updated);
    } else {
      const updated = groups.map(g => {
        if (g.id === selectedGroupId) {
          const updatedContacts = g.contacts.map(c => 
            c.id === targetContactId 
              ? { ...c, name: contactForm.name.trim(), phone: contactForm.phone.trim(), email: contactForm.email.trim(), notes: contactForm.notes.trim() } 
              : c
          );
          return { ...g, contacts: updatedContacts };
        }
        return g;
      });
      setGroups(updated);
    }
    setContactModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    if (!selectedGroupId) return;
    if (confirm("Are you sure you want to delete this contact?")) {
      const updated = groups.map(g => {
        if (g.id === selectedGroupId) {
          return { ...g, contacts: g.contacts.filter(c => c.id !== id) };
        }
        return g;
      });
      setGroups(updated);
    }
  };

  const handleToggleContact = (id: string, checked: boolean) => {
    if (!selectedGroupId) return;
    const updated = groups.map(g => {
      if (g.id === selectedGroupId) {
        return { ...g, contacts: g.contacts.map(c => c.id === id ? { ...c, enabled: checked } : c) };
      }
      return g;
    });
    setGroups(updated);
  };

  // CSV Import Handlers
  const handleOpenCsvImport = () => {
    setCsvInput("");
    setCsvFileName("");
    setCsvNewGroupName("");
    setCsvExistingGroupId(selectedGroupId || "");
    setCsvTargetMode("new");
    setCsvModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvInput(text);
    };
    reader.readAsText(file);
  };

  const handleImportCSV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;

    const parsed = parseCSV(csvInput);
    if (parsed.length === 0) {
      alert("No contacts found in the CSV data. Please check the format.");
      return;
    }

    const importedContacts: Contact[] = parsed.map((item, idx) => ({
      id: `c-${Date.now()}-${idx}`,
      name: item.name,
      phone: item.phone,
      email: item.email,
      notes: item.notes,
      enabled: true,
    }));

    if (csvTargetMode === "new") {
      const newGroupId = `g-${Date.now()}`;
      const newGroupName = csvNewGroupName.trim() || `Imported ${csvFileName || "List"}`;
      const newGroup: ContactGroup = {
        id: newGroupId,
        name: newGroupName,
        enabled: true,
        contacts: importedContacts,
      };
      setGroups([...groups, newGroup]);
      setSelectedGroupId(newGroupId);
    } else {
      const updated = groups.map(g => {
        if (g.id === csvExistingGroupId) {
          return { ...g, contacts: [...g.contacts, ...importedContacts] };
        }
        return g;
      });
      setGroups(updated);
      setSelectedGroupId(csvExistingGroupId);
    }
    setCsvModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts & Groups</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize people in active/inactive groups and manage campaign reach.</p>
        </div>
      </header>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="text-xs text-muted-foreground">Total Contacts</div>
          <div className="text-2xl font-bold mt-1.5">{totalContactsCount.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="text-xs text-muted-foreground">Active Reachable Contacts</div>
          <div className="text-2xl font-bold mt-1.5 text-mint-deep">{totalActiveContactsCount.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="text-xs text-muted-foreground">Total Groups</div>
          <div className="text-2xl font-bold mt-1.5">{groups.length}</div>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="text-xs text-muted-foreground">Active Groups</div>
          <div className="text-2xl font-bold mt-1.5 text-emerald-600">{activeGroupsCount}</div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left Side: Group list */}
        <aside className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <span className="font-semibold text-sm flex items-center gap-1.5"><Folder className="size-4 text-mint-deep" /> Groups ({groups.length})</span>
            <Button size="sm" onClick={handleOpenCreateGroup} className="rounded-lg h-8 px-2.5 text-xs gradient-mint text-ink font-semibold shadow-glow">
              <Plus className="size-3.5 mr-1" strokeWidth={2.5} /> Add Group
            </Button>
          </div>
          <div className="p-2 space-y-1.5 max-h-[580px] overflow-y-auto">
            {groups.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No groups created yet. Create a group to add contacts.</div>
            ) : (
              groups.map((g) => {
                const isSelected = g.id === selectedGroupId;
                const totalContacts = g.contacts.length;
                const activeContacts = g.contacts.filter(c => c.enabled).length;

                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGroupId(g.id)}
                    className={cn(
                      "group flex flex-col p-3 rounded-xl border transition-all cursor-pointer",
                      isSelected 
                        ? "border-mint bg-mint-soft/50 shadow-sm" 
                        : "border-transparent bg-transparent hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("font-semibold text-sm truncate", !g.enabled && "text-muted-foreground line-through")}>
                        {g.name}
                      </span>
                      <Switch 
                        checked={g.enabled} 
                        onChange={(val) => handleToggleGroup(g.id, val)} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-2.5 text-xs text-muted-foreground">
                      <span>{activeContacts} / {totalContacts} active</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleOpenRenameGroup(e, g)}
                          className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground pointer-events-auto"
                          title="Rename Group"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteGroup(e, g.id)}
                          className="p-1 rounded hover:bg-rose-50 text-muted-foreground hover:text-rose-600 pointer-events-auto"
                          title="Delete Group"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Side: Selected Group Contacts */}
        <section className="space-y-4">
          {!selectedGroup ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center bg-card shadow-card">
              <Folder className="size-14 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-display font-semibold text-lg">No group selected</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Select an existing group from the left panel, or create a new group to start organizing your contacts.
              </p>
              <Button onClick={handleOpenCreateGroup} className="mt-5 rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow">
                <Plus className="size-4 mr-1.5" /> Create a Group
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
              {/* Group Panel Header */}
              <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-muted/20">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-bold">{selectedGroup.name}</h2>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                    selectedGroup.enabled 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}>
                    {selectedGroup.enabled ? "Active Group" : "Inactive Group"}
                  </span>
                  {!selectedGroup.enabled && (
                    <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="size-3.5" /> All contacts are currently inactive
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleOpenCsvImport} className="rounded-xl h-10 border-border">
                    <Upload className="size-4 mr-1.5" /> Import CSV
                  </Button>
                  <Button onClick={handleOpenCreateContact} className="rounded-xl h-10 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                    <Plus className="size-4 mr-1.5" /> Add Contact
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-border flex gap-3 items-center bg-card">
                <div className="relative flex-1">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <TextInput 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${selectedGroup.contacts.length} contacts in this group…`} 
                    className="pl-9 h-10 rounded-xl bg-background border-border" 
                  />
                </div>
                {searchQuery && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="text-xs h-10 px-3 hover:bg-muted rounded-xl">
                    Clear
                  </Button>
                )}
              </div>

              {/* Table / List */}
              {selectedGroup.contacts.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="size-10 text-muted-foreground/60 mx-auto mb-3" />
                  <h4 className="font-semibold text-base">This group is empty</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    You can add contacts manually using "+ Add Contact" or import them from a CSV spreadsheet.
                  </p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                  No contacts match your search "{searchQuery}"
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/30 border-b border-border">
                        <th className="px-5 py-3 font-medium w-16">Active</th>
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium">Phone</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Notes</th>
                        <th className="px-5 py-3 font-medium w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((c) => {
                        const isContactEnabled = selectedGroup.enabled && c.enabled;
                        return (
                          <tr key={c.id} className={cn("border-b border-border last:border-0 hover:bg-mint-soft/20 transition-colors", !isContactEnabled && "bg-muted/10")}>
                            <td className="px-5 py-4">
                              <Switch 
                                checked={c.enabled} 
                                onChange={(val) => handleToggleContact(c.id, val)}
                                disabled={!selectedGroup.enabled}
                              />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "size-8 rounded-full grid place-items-center text-ink text-xs font-bold shrink-0",
                                  isContactEnabled ? "gradient-mint" : "bg-muted text-muted-foreground"
                                )}>
                                  {c.name ? c.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase() : "?"}
                                </div>
                                <div className="font-semibold">{c.name || "Unnamed"}</div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-muted-foreground whitespace-nowrap"><Phone className="size-3.5 inline mr-1.5 text-mint-deep/80" />{c.phone || "—"}</td>
                            <td className="px-5 py-4 text-muted-foreground whitespace-nowrap"><Mail className="size-3.5 inline mr-1.5 text-mint-deep/80" />{c.email || "—"}</td>
                            <td className="px-5 py-4 text-muted-foreground max-w-xs truncate">{c.notes || "—"}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleOpenEditContact(c)}
                                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                  title="Edit Contact"
                                >
                                  <Edit2 className="size-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteContact(c.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600 cursor-pointer"
                                  title="Delete Contact"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ---- DIALOGS & MODALS ---- */}

      {/* 1. Group Create / Rename Dialog */}
      <Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border border-border shadow-elevated">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {groupModalMode === "create" ? "Create Contact Group" : "Rename Group"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveGroup} className="space-y-4 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Group Name</label>
              <TextInput 
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                placeholder="e.g. Inbound Hot Leads" 
                required
                className="rounded-xl border-border bg-background focus:ring-mint focus:border-mint"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setGroupModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                {groupModalMode === "create" ? "Create Group" : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Contact Add / Edit Dialog */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border border-border shadow-elevated">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {contactModalMode === "create" ? "Add New Contact" : "Edit Contact"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveContact} className="space-y-4 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <TextInput 
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Jane Doe" 
                required
                className="rounded-xl border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <TextInput 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +1 555-0199" 
                  required
                  className="rounded-xl border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <TextInput 
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. jane@example.com" 
                  type="email"
                  required
                  className="rounded-xl border-border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Notes</label>
              <textarea 
                value={contactForm.notes}
                onChange={(e) => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add customer background, lead score, or general notes..." 
                className="w-full min-h-[80px] rounded-xl border border-border bg-background outline-none p-3 text-sm focus:ring-4 focus:ring-mint/15 focus:border-mint transition-all"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setContactModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow">
                {contactModalMode === "create" ? "Add Contact" : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. CSV Import Dialog */}
      <Dialog open={csvModalOpen} onOpenChange={setCsvModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-card border border-border shadow-elevated">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-mint-deep" /> Import Contacts from CSV
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleImportCSV} className="space-y-4 mt-3">
            {/* File upload zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-mint/60 bg-muted/20 hover:bg-mint-soft/20 rounded-xl p-6 text-center cursor-pointer transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv,.txt" 
                className="hidden" 
              />
              <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold text-sm">
                {csvFileName ? `File selected: ${csvFileName}` : "Click to select or upload a CSV file"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                CSV should contain Name, Phone, Email, and Notes columns
              </div>
            </div>

            {/* Pasted Raw text */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium">Or paste raw CSV text</label>
                {csvInput.trim() && (
                  <span className="text-xs text-mint-deep font-semibold">
                    {parseCSV(csvInput).length} contacts parsed
                  </span>
                )}
              </div>
              <textarea 
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="Name,Phone,Email,Notes&#10;John Smith,+15550001,john@example.com,Starter interest&#10;Emma Watson,+15550002,emma@example.com,Enterprise client"
                className="w-full min-h-[100px] font-mono text-xs rounded-xl border border-border bg-background outline-none p-3 focus:ring-4 focus:ring-mint/15 focus:border-mint transition-all"
              />
            </div>

            {/* Target selection */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Import Destination</span>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                  <input 
                    type="radio" 
                    name="csvTarget" 
                    checked={csvTargetMode === "new"}
                    onChange={() => setCsvTargetMode("new")}
                    className="accent-mint" 
                  />
                  Create a new group
                </label>
                <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                  <input 
                    type="radio" 
                    name="csvTarget" 
                    checked={csvTargetMode === "existing"}
                    onChange={() => setCsvTargetMode("existing")}
                    className="accent-mint" 
                  />
                  Import into existing group
                </label>
              </div>

              {csvTargetMode === "new" ? (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">New Group Name</label>
                  <TextInput 
                    value={csvNewGroupName}
                    onChange={(e) => setCsvNewGroupName(e.target.value)}
                    placeholder="e.g. CSV Imported Leads" 
                    required={csvTargetMode === "new"}
                    className="h-9 rounded-lg border-border text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Select Group</label>
                  <ThemedSelect
                    value={csvExistingGroupId}
                    onChange={setCsvExistingGroupId}
                    options={groups.map(g => ({ value: g.id, label: g.name }))}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setCsvModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!csvInput.trim()}
                className="rounded-xl gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import Contacts
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
