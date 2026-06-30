import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Phone, Users, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput, Field } from "@/components/ui-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { defaultHumanNumbers, type HumanNumber } from "@/lib/mock-data";
import { useScopedList } from "@/lib/workspace-context";

export const Route = createFileRoute("/_app/human-numbers")({
  head: () => ({ meta: [{ title: "Human Numbers — Tunis Agent Ai" }] }),
  component: HumanNumbersPage,
});

function HumanNumbersPage() {
  const [numbers, setNumbers] = useScopedList<HumanNumber>("humanNumbers", defaultHumanNumbers);

  // Dialog States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form inputs
  const [numberInput, setNumberInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [labelInput, setLabelInput] = useState("");

  const handleOpenAdd = () => {
    setNameInput("");
    setNumberInput("");
    setLabelInput("");
    setAddModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !numberInput.trim() || !labelInput.trim()) return;

    const newNumber: HumanNumber = {
      id: `hn-${Date.now()}`,
      number: numberInput.trim(),
      name: nameInput.trim(),
      label: labelInput.trim(),
    };

    setNumbers([...numbers, newNumber]);
    setAddModalOpen(false);
  };

  const handleOpenEdit = (hn: HumanNumber) => {
    setEditingId(hn.id);
    setNameInput(hn.name);
    setNumberInput(hn.number);
    setLabelInput(hn.label);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    const updated = numbers.map((n) => {
      if (n.id === editingId) {
        return {
          ...n,
          name: nameInput.trim(),
          number: numberInput.trim(),
          label: labelInput.trim(),
        };
      }
      return n;
    });

    setNumbers(updated);
    setEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this human number?")) {
      setNumbers(numbers.filter((n) => n.id !== id));
      setEditModalOpen(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Human Numbers</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage destination numbers for call transfers to live human agents.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="rounded-xl h-11 px-5 gradient-mint text-ink font-semibold hover:opacity-90 shadow-glow transition-all hover:scale-[1.02]"
        >
          <Plus className="size-4 mr-1.5" strokeWidth={2.5} /> Add Human Number
        </Button>
      </header>

      {numbers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-mint/40 bg-mint-soft/20 p-12 text-center">
          <div className="size-14 rounded-2xl gradient-mint grid place-items-center text-ink mx-auto mb-3 shadow-glow">
            <Users className="size-6" />
          </div>
          <h3 className="font-display font-semibold text-lg">No human numbers defined yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Add live agent phone numbers so your AI voice agents can transfer calls to them.
          </p>
          <Button onClick={handleOpenAdd} className="mt-5 rounded-xl h-11 px-5 gradient-mint text-ink font-semibold shadow-glow">
            <Plus className="size-4 mr-1.5" /> Add First Number
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {numbers.map((n) => (
            <div
              key={n.id}
              className="group rounded-2xl bg-card border border-border shadow-card p-5 hover:shadow-elevated transition-all flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div className="flex items-start gap-3 mb-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-mint-soft text-mint-deep grid place-items-center shrink-0">
                      <Users className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-semibold text-base truncate">{n.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{n.label}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenEdit(n)}
                    className="p-1.5 rounded-lg border border-border hover:border-mint hover:bg-mint-soft/30 hover:text-mint-deep text-muted-foreground transition-all cursor-pointer shrink-0"
                    title="Edit Details"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground mt-4 border-t border-border/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-mint-deep" />
                    <span className="text-foreground font-medium">{n.number}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-card border border-border p-6 shadow-elevated">
          <DialogHeader>
            <DialogTitle>Add Human Number</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <Field label="Agent Name" hint="Full name of the human agent.">
              <TextInput
                required
                placeholder="e.g. John Connor"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </Field>

            <Field label="Phone Number" hint="Destination number for call forwarding.">
              <TextInput
                required
                placeholder="e.g. +1 555-0100"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
              />
            </Field>

            <Field label="Label / Role" hint="e.g. Escalations, Support Rep, Sales Lead.">
              <TextInput
                required
                placeholder="e.g. Technical Support"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
              />
            </Field>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/60 mt-6">
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gradient-mint text-ink font-semibold">
                Add Number
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-card border border-border p-6 shadow-elevated">
          <DialogHeader>
            <DialogTitle>Edit Human Number</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <Field label="Agent Name" hint="Full name of the human agent.">
              <TextInput
                required
                placeholder="e.g. John Connor"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </Field>

            <Field label="Phone Number" hint="Destination number for call forwarding.">
              <TextInput
                required
                placeholder="e.g. +1 555-0100"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
              />
            </Field>

            <Field label="Label / Role" hint="e.g. Escalations, Support Rep, Sales Lead.">
              <TextInput
                required
                placeholder="e.g. Technical Support"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/60 mt-6">
              <button
                type="button"
                onClick={() => editingId && handleDelete(editingId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <Trash2 className="size-4" /> Delete Number
              </button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl gradient-mint text-ink font-semibold">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
