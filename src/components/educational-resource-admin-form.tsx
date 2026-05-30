"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Textarea } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const categories = ["Alfabetizacao", "Matematica", "Inclusao", "Gestao pedagogica", "Formacao", "Documentos", "FNDE/PDDE"];

export function EducationalResourceAdminForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Salvando recurso educacional...");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const tagsRaw = String(formData.get("tags") ?? "").trim();
    const { error } = await supabase.from("educational_resources").insert({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? "Documentos"),
      type: String(formData.get("type") ?? "Link"),
      stage: String(formData.get("stage") ?? "") || null,
      modality: String(formData.get("modality") ?? "") || null,
      external_url: String(formData.get("url") ?? "") || null,
      status: String(formData.get("status") ?? "rascunho"),
      tags: tagsRaw ? tagsRaw.split(",").map((tag) => tag.trim()).filter(Boolean) : []
    });

    setLoading(false);

    if (error) {
      setStatus(`Nao foi possivel salvar: ${error.message}. Confirme se a migration operacional foi aplicada.`);
      return;
    }

    event.currentTarget.reset();
    setStatus("Recurso educacional cadastrado com sucesso.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo recurso educacional</CardTitle>
        <p className="text-sm text-neutral-600">Cadastre links, materiais e documentos para exibicao no portal publico.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title">Titulo</Label>
            <Input id="title" name="title" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select id="category" name="category" className="mt-2">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select id="type" name="type" className="mt-2">
              <option value="Link">Link</option>
              <option value="PDF">PDF</option>
              <option value="Video">Video</option>
              <option value="Modelo">Modelo</option>
              <option value="Outro">Outro</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" className="mt-2">
              <option value="rascunho">Rascunho</option>
              <option value="publico">Publico</option>
              <option value="arquivado">Arquivado</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="stage">Etapa</Label>
            <Input id="stage" name="stage" className="mt-2" placeholder="Ex.: Ensino Fundamental" />
          </div>
          <div>
            <Label htmlFor="modality">Modalidade</Label>
            <Input id="modality" name="modality" className="mt-2" placeholder="Ex.: Regular, EJA, AEE" />
          </div>
          <div>
            <Label htmlFor="url">Link de acesso</Label>
            <Input id="url" name="url" type="url" className="mt-2" placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" name="tags" className="mt-2" placeholder="planejamento, leitura, avaliacao" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea id="description" name="description" required className="mt-2" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-neutral-600">{status || "O recurso sera gravado em educational_resources."}</p>
            <Button type="submit" loading={loading}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Salvar recurso
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
