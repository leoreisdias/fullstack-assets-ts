// Estrutura baseada em Next.js 14 (app directory)
// Abordagem 3 com filtros, paginação via URL, transições visuais e comentários explicativos

// --- app/layout.tsx ---
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Cria o client do React Query no client
  const [client] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={client}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}

// --- lib/fetcher.ts ---
// Função para buscar pedidos da API com base em página e filtro
export async function fetchOrders(query: { page: number; filter: string }) {
  const { page, filter } = query;
  const res = await fetch(
    `https://api.example.com/orders?page=${page}&filter=${filter}`
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

// --- lib/query-client.ts ---
import { QueryClient } from "@tanstack/react-query";
let queryClient: QueryClient | null = null;

// Garante que só existe uma instância de QueryClient
export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
}

// --- app/orders/page.tsx ---
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { fetchOrders } from "@/lib/fetcher";
import OrdersClient from "./orders-client";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; filter?: string };
}) {
  // Extrai parâmetros da URL
  const page = Number(searchParams.page ?? "1");
  const filter = searchParams.filter ?? "";

  const queryClient = getQueryClient();

  // Faz prefetch no server para essa query antes de renderizar
  await queryClient.prefetchQuery({
    queryKey: ["orders", { page, filter }],
    queryFn: () =>
      fetcher(`url?${convertObjectToQueryParams({ page, filter })}`),
  });

  // Envia os dados para o client já cacheados
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersClient page={page} filter={filter} />
    </HydrationBoundary>
  );
}

// --- app/orders/orders-client.tsx ---
("use client");
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/fetcher";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

export default function OrdersClient({
  page,
  filter,
}: {
  page: number;
  filter: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition(); // Indica transições de UI

  // Carrega os dados com base na URL e cache pré-hidratado
  const { data, isFetching } = useQuery({
    queryKey: ["orders", { page, filter }],
    queryFn: () => fetchOrders({ page, filter }),
    staleTime: 30 * 1000, // Cache válido por 30s
  });

  // Atualiza o filtro e reinicia a paginação para 1
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  // Avança para a próxima página
  const handleNextPage = () => {
    const nextPage = page + 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div>
      <h1>Orders - Page {page}</h1>

      {/* Campo de filtro controlado via URL */}
      <input
        type="text"
        defaultValue={filter}
        onChange={handleFilterChange}
        placeholder="Filtrar pedidos"
      />

      {/* Mostra loading se estiver em transição ou refetching */}
      {(isPending || isFetching) && <p>Atualizando dados...</p>}

      {/* Lista de pedidos */}
      <ul>
        {data?.orders?.map((order: any) => (
          <li key={order.id}>{order.title}</li>
        ))}
      </ul>

      {/* Botão para próxima página */}
      <button onClick={handleNextPage}>Próxima página</button>
    </div>
  );
}

// --- app/actions/create-order.ts ---
("use server");
// Server Action para criar um novo pedido
export async function createOrder(data: any) {
  const res = await fetch("https://api.example.com/orders", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Erro ao criar pedido");
  return res.json();
}

// --- app/orders/create-order-form.tsx ---
("use client");
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/app/actions/create-order";
import { fetcher } from "../fetcher-sender";
import { convertObjectToQueryParams } from "../../../isomorphic/transform/query-params";

export default function CreateOrderForm() {
  const queryClient = useQueryClient();

  // useMutation para enviar novo pedido e invalidar cache
  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalida a query 'orders' para forçar refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const title = new FormData(e.currentTarget).get("title") as string;
        mutation.mutate({ title });
      }}
    >
      <input name="title" placeholder="Novo pedido" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Enviando..." : "Criar pedido"}
      </button>
    </form>
  );
}
