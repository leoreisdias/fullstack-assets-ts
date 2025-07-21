# 🖱️ Drag Scroll em Tabelas TanStack

## Why do this?

Quando você tem tabelas com muitas colunas, o scroll horizontal tradicional pode ser incômodo para os usuários.  
Implementar drag scroll torna a navegação mais intuitiva e fluida, similar ao comportamento de aplicativos modernos.

O desafio é implementar drag scroll **sem interferir na seleção de texto** e com um **threshold** para evitar acionamento acidental.

---

## 🛠️ Implementação com PandaCSS

Aqui está como criar um componente de tabela com drag scroll usando PandaCSS:

```tsx
import React from "react";
import { styled } from "../../styled-system/jsx";

const TableContainer = styled("div", tableContainer);

const SCROLL_SPEED = 1.5; // Velocidade do scroll (ajustável via props)
const DRAG_THRESHOLD = 10; // Pixels necessários para ativar o drag

const BaseTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, forwardedRef) => {
  const tableRef = React.useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableRef.current) return;

    // Verifica se o mouse está sobre o tbody para ativar o drag scroll
    const target = e.target as HTMLElement;
    let isInTbody = false;
    let el: HTMLElement | null = target;

    while (el && el !== tableRef.current) {
      if (el.tagName.toLowerCase() === "tbody") {
        isInTbody = true;
        break;
      }
      el = el.parentElement;
    }

    if (!isInTbody) return;

    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1 || !tableRef.current) return;

    // Verifica se o mouse está sobre o tbody para permitir o drag scroll
    const target = e.target as HTMLElement;
    let isInTbody = false;
    let el: HTMLElement | null = target;

    while (el && el !== tableRef.current) {
      if (el.tagName.toLowerCase() === "tbody") {
        isInTbody = true;
        break;
      }
      el = el.parentElement;
    }

    if (!isInTbody) return;

    const x = e.pageX - tableRef.current.offsetLeft;

    // Só ativa o dragging após o threshold
    if (!isDragging && Math.abs(x - startX) > DRAG_THRESHOLD) {
      setIsDragging(true);
    }

    // Se não estiver em drag, não faz nada (permitindo seleção de texto)
    if (!isDragging) return;

    const walk = (x - startX) * SCROLL_SPEED;
    requestAnimationFrame(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft = scrollLeft - walk;
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <TableContainer
      role="table"
      aria-label="Scrollable table"
      tabIndex={0}
      ref={tableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      overflowX="auto"
      width="100%"
      maxWidth="100%"
      borderRadius="md"
      border="1px solid"
      borderColor="border.muted"
      userSelect={isDragging ? "none" : "text"}
      cursor={isDragging ? "grabbing" : undefined}
      {...props}
    />
  );
});

BaseTable.displayName = "Table";
```

---

## ⚡ Technical Insights

### About User Experience:

- **Threshold de Drag**: `DRAG_THRESHOLD` evita acionamento acidental do drag scroll. O usuário precisa mover o mouse pelo menos 10px antes do drag ser ativado.
- **Seleção de Texto Preservada**: Enquanto não estiver em modo drag, o `userSelect` permanece como `"text"`, permitindo seleção normal.
- **Cursor Visual**: O cursor muda para `"grabbing"` durante o drag, fornecendo feedback visual claro.

### About Performance:

- **requestAnimationFrame**: Garante que o scroll seja suave e sincronizado com o refresh rate do browser.
- **Event Delegation**: Verifica se o evento ocorreu no `tbody` para limitar o drag scroll apenas à área de dados.
- **Estado Minimal**: Apenas três estados são mantidos: `isDragging`, `startX`, e `scrollLeft`.

### About Accessibility:

- **ARIA**: `role="table"` e `aria-label` garantem que a tabela seja acessível para screen readers.
- **Keyboard Navigation**: `tabIndex={0}` permite navegação por teclado.
- **Hover States**: O cursor muda conforme o estado, proporcionando feedback visual.

---

## 🎯 Variações e Melhorias

### Versão com Props Configuráveis:

```tsx
interface DragScrollTableProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollSpeed?: number;
  dragThreshold?: number;
  allowDragInHeader?: boolean;
}

const DragScrollTable = ({
  scrollSpeed = 1.5,
  dragThreshold = 10,
  allowDragInHeader = false,
  ...props
}: DragScrollTableProps) => {
  // ... implementação similar, mas usando as props
};
```

### Versão com Momentum Scrolling:

```tsx
// Adicione um estado para momentum
const [momentum, setMomentum] = React.useState(0);

// No handleMouseMove, calcule a velocidade
const velocity = (x - startX) * scrollSpeed;
setMomentum(velocity);

// Use useEffect para criar o momentum scrolling
React.useEffect(() => {
  if (!isDragging && Math.abs(momentum) > 0.1) {
    const timer = requestAnimationFrame(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft += momentum;
        setMomentum(momentum * 0.95); // Damping factor
      }
    });
    return () => cancelAnimationFrame(timer);
  }
}, [isDragging, momentum]);
```

---

## 📌 Practical Summary

- O drag scroll melhora significativamente a UX em tabelas largas.
- O threshold previne acionamentos acidentais e preserva a seleção de texto.
- A verificação de `tbody` garante que o drag só funcione na área de dados.
- `requestAnimationFrame` proporciona scrolling suave e performático.
- PandaCSS oferece uma API limpa para styling responsivo e acessível.

---

Use este padrão quando suas tabelas TanStack tiverem muitas colunas e você quiser oferecer uma experiência de navegação mais moderna e intuitiva.
