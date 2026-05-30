import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ModuleHeader } from "@/components/module-header";

async function salvarRecurso(formData: FormData) {
  "use server";

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const type = (formData.get("type") as string)?.trim();
  const stage = (formData.get("stage") as string)?.trim() || null;
  const modality = (formData.get("modality") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const external_url = (formData.get("external_url") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "rascunho";
  const tagsRaw = (formData.get("tags") as string)?.trim() || "";
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const file = formData.get("file");

  if (!title || !category || !type) {
    redirect("/recursos-educacionais-cadastro?erro=campos-obrigatorios");
  }

  let file_path: string | null = null;

  if (file instanceof File && file.size > 0) {
    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    file_path = `portal-recursos-educacionais/${user.id}/${Date.now()}-${safeName || "arquivo"}`;

    const { error: uploadError } = await supabase.storage
      .from("documentos-gppe")
      .upload(file_path, file, {
        contentType: file.type || undefined,
        upsert: false
      });

    if (uploadError) {
      redirect("/recursos-educacionais-cadastro?erro=upload");
    }
  }

  const { error } = await supabase.from("educational_resources").insert({
    title,
    category,
    type,
    stage,
    modality,
    description,
    file_path,
    external_url,
    status,
    tags,
    created_by: user.id
  });

  if (error) {
    redirect("/recursos-educacionais-cadastro?erro=salvar");
  }

  redirect("/recursos-educacionais-cadastro?salvo=1");
}

const categorias = [
  "Alfabetização",
  "Matemática",
  "Inclusão",
  "Gestão pedagógica",
  "Formação",
  "Documentos",
  "Outro"
];

const tipos = ["PDF", "Vídeo", "Link", "Modelo", "Outro"];

const etapas = [
  "Educação Infantil",
  "Ensino Fundamental - Anos Iniciais",
  "Ensino Fundamental - Anos Finais",
  "EJA",
  "AEE",
  "Todas as etapas"
];

export default async function RecursosEducacionaisCadastroPage({
  searchParams
}: {
  searchParams: { salvo?: string; erro?: string };
}) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Cadastrar recurso educacional"
        description="Adicione materiais pedagógicos, orientações, modelos e links para o portal público da SME."
        icon={GraduationCap}
      />

      {searchParams.salvo && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
          Recurso cadastrado com sucesso! Recursos com status &ldquo;Publico&rdquo; ja aparecem no portal.
        </div>
      )}

      {searchParams.erro && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {searchParams.erro === "upload"
            ? "Nao foi possivel enviar o arquivo. Verifique o formato e tente novamente."
            : searchParams.erro === "salvar"
              ? "Nao foi possivel salvar o recurso no banco de dados."
              : "Preencha os campos obrigatorios: titulo, categoria e tipo."}
        </div>
      )}

      <form action={salvarRecurso} encType="multipart/form-data" className="space-y-5 rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="font-black text-sme-ink">Informações do recurso</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              maxLength={200}
              placeholder="Ex: Sequência didática de leitura"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
            >
              <option value="">Selecione...</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Tipo de recurso <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
            >
              <option value="">Selecione...</option>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Status de publicacao
            </label>
            <select
              name="status"
              defaultValue="rascunho"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
            >
              <option value="rascunho">Rascunho (não aparece no portal)</option>
              <option value="publico">Público (aparece no portal)</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Etapa escolar
            </label>
            <select
              name="stage"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
            >
              <option value="">Nao informada</option>
              {etapas.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Modalidade
            </label>
            <input
              name="modality"
              maxLength={100}
              placeholder="Ex: Inclusão, EJA, Regular"
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700">
            Descrição
          </label>
          <textarea
            name="description"
            rows={3}
            maxLength={500}
            placeholder="Descreva brevemente o conteúdo e finalidade do recurso."
            className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700">
            Link externo (URL)
          </label>
          <input
            name="external_url"
            type="url"
            placeholder="https://..."
            className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
          />
          <p className="mt-1 text-xs text-slate-500">Cole aqui o link do arquivo no Google Drive, YouTube ou outro servico.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700">
            Arquivo do recurso
          </label>
          <input
            name="file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-sme-blue file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow"
          />
          <p className="mt-1 text-xs text-slate-500">
            Use PDF, imagem ou planilha. O arquivo sera salvo no Supabase Storage e publicado junto com o recurso.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700">
            Tags (palavras-chave)
          </label>
          <input
            name="tags"
            placeholder="Ex: planejamento, leitura, escrita"
            className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-sme-yellow"
          />
          <p className="mt-1 text-xs text-slate-500">Separe as palavras-chave por virgula.</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-sme-blue px-5 text-sm font-black text-white hover:bg-sme-navy focus:outline-none focus:ring-2 focus:ring-sme-yellow focus:ring-offset-2"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Salvar recurso
          </button>
          <a
            href="/recursos-educacionais"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-sme-ink hover:bg-blue-50"
          >
            Ver portal público
          </a>
        </div>
      </form>

      <section className="rounded-md border border-amber-200 bg-amber-50 p-4 shadow-soft">
        <p className="text-sm font-bold text-amber-800">Sobre o upload de arquivos</p>
        <p className="mt-1 text-sm leading-6 text-amber-700">
          Voce pode informar um link externo, enviar um arquivo direto, ou usar os dois. Recursos publicados ficam disponiveis no portal publico.
        </p>
      </section>
    </div>
  );
}
