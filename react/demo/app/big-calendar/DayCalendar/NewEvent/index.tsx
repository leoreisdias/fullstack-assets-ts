import { useState } from "react";
import { Box, Flex } from "../../../../styled-system/jsx";

type NewEventProps = {
  onCancel: () => void;
  mutate: () => void;
};

export const NewEvent = ({ onCancel, mutate }: NewEventProps) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica para criar o evento
    mutate();
    onCancel();
  };

  return (
    <Box p="4" borderRadius="md" bg="#fff" minW="320px">
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#0575e6",
          textAlign: "center",
        }}
      >
        Nova reunião
      </h3>
      <form onSubmit={onSubmit}>
        <Box mb="4">
          <label htmlFor="title" style={{ fontWeight: "bold" }}>
            Título
          </label>
          <input
            id="title"
            name="title"
            placeholder="Informe o título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e0e0e0",
              marginTop: "4px",
            }}
            required
          />
        </Box>
        <Flex gap="2" mb="4">
          <Box flex="1">
            <label htmlFor="start" style={{ fontWeight: "bold" }}>
              Início
            </label>
            <input
              id="start"
              name="start"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
                marginTop: "4px",
              }}
              required
            />
          </Box>
          <Box flex="1">
            <label htmlFor="end" style={{ fontWeight: "bold" }}>
              Fim
            </label>
            <input
              id="end"
              name="end"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e0e0e0",
                marginTop: "4px",
              }}
              required
            />
          </Box>
        </Flex>
        <Flex gap="2" justify="flex-end">
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "#e0e0e0",
              color: "#222",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              background: "#0575e6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Salvar
          </button>
        </Flex>
      </form>
    </Box>
  );
};
