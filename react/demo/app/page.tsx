import { Flex } from "../styled-system/jsx";
import { css } from "../styled-system/css";
import Link from "next/link";

export default function Home() {
  return (
    <Flex
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      bgGradient="linear(to-br, #f8fafc, #e0e7ef)"
      gap="8"
    >
      <div style={{ textAlign: "center" }}>
        <h1
          className={css({
            fontSize: "3xl",
            fontWeight: "bold",
            mb: "4",
            color: "#0575e6",
          })}
        >
          Fullstack Assets Demo
        </h1>
        <p
          className={css({
            fontSize: "xl",
            color: "#333",
            mb: "6",
          })}
        >
          Demonstração de componentes reutilizáveis com <b>PandaCSS</b> e{" "}
          <b>Next.js</b>
        </p>
        <p
          className={css({
            fontSize: "md",
            color: "#666",
            mb: "8",
          })}
        >
          Explore exemplos práticos de componentes modernos, prontos para uso em
          projetos reais.
        </p>
        <Link
          href="/big-calendar"
          className={css({
            display: "inline-block",
            bg: "#0575e6",
            color: "white",
            borderRadius: "md",
            px: "8",
            py: "6",
            fontWeight: "bold",
            fontSize: "lg",
            boxShadow: "md",
            textDecoration: "none",
            transition: "background 0.2s",
            _hover: { bg: "#0366d6" },
          })}
        >
          Ver BigCalendar Demo
        </Link>
      </div>
    </Flex>
  );
}
