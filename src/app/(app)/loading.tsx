import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item}>
            <CardContent className="space-y-4 p-6">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
              <div className="h-8 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="flex min-h-56 items-center justify-center p-6">
          <LoadingSpinner label="Carregando informações do GPPE" />
        </CardContent>
      </Card>
    </div>
  );
}
