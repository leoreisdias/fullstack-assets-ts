import { ReactNode, useEffect, useId, useState } from "react";
import styled, { CSSObject } from "styled-components";
import { css } from "styled-components";

const CardStyle = styled.div<{ showMore: boolean; sx?: CSSObject }>`
  padding: 1rem;
  border-radius: 0.25rem;
  background: #fafcff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #ced4da;

  text-align: justify;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: ${(props) => props.theme.COLORS.font};
  font-weight: 500;

  min-height: 270px;

  transition: all 0.2s;

  line-height: 1.25rem;
  position: relative;

  & > span {
    height: 100%;
    width: 100%;
  }

  ${(props) =>
    !props.showMore &&
    css`
      max-height: 275px;

      & > span {
        overflow: hidden;
      }
    `}

  ${(props) =>
    props.showMore &&
    css`
      & > span {
        all: revert;
        padding-bottom: 2rem;
      }
    `}


  button {
    box-shadow: 0px -10px 10px 10px rgba(250, 252, 255, 0.8);

    width: 100%;

    position: absolute;
    bottom: 0;
    left: 0;

    transition: all 0.2s ease;

    padding: 0.5rem 0.25rem;

    background: rgba(250, 252, 255, 0.95);
    color: #0064fa;

    border-radius: 0.25rem 0.25rem 0 0;
    overflow-x: hidden;

    ${(props) =>
      props.showMore &&
      css`
        box-shadow: none;
      `}

    &:hover {
      background: #f0f6ff;
    }
  }

  ${(props) => props.sx}
`;

export const VExpandableCard = ({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: CSSObject;
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const id = useId();

  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      if (element?.offsetHeight < element?.scrollHeight) {
        setShowButton(true);
      }
    }
  }, [id]);

  return (
    <CardStyle showMore={showMore} sx={sx}>
      <span id={id}>{children}</span>
      {showButton && (
        <button type="button" onClick={() => setShowMore((old) => !old)}>
          {showMore ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </CardStyle>
  );
};
