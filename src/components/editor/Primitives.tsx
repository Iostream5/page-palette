import React from 'react';
import { cn } from '@/lib/utils';

export interface BasePrimitiveProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // Style Props
  margin?: React.CSSProperties['margin'];
  padding?: React.CSSProperties['padding'];
  gap?: React.CSSProperties['gap'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  background?: React.CSSProperties['background'];
  border?: React.CSSProperties['border'];
}

function getBaseStyles(props: BasePrimitiveProps): React.CSSProperties {
  return {
    ...props.style,
    margin: props.margin,
    padding: props.padding,
    gap: props.gap,
    width: props.width,
    height: props.height,
    background: props.background,
    border: props.border,
  };
}

export function Box({ children, className, ...rest }: BasePrimitiveProps) {
  return (
    <div
      className={cn("w-full h-full", className)}
      style={getBaseStyles(rest)}
    >
      {children}
    </div>
  );
}

export interface FlexProps extends BasePrimitiveProps {
  direction?: 'row' | 'column';
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: React.CSSProperties['flexWrap'];
}

export function Flex({
  children,
  className,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  ...rest
}: FlexProps) {
  // Mapping logic for justify-content
  const justifyMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  // Mapping logic for align-items
  const alignMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={cn(
        "flex w-full h-full",
        direction === 'column' ? 'flex-col' : 'flex-row',
        alignMap[align as string] || 'items-stretch',
        justifyMap[justify as string] || 'justify-start',
        wrap === 'wrap' ? 'flex-wrap' : wrap === 'wrap-reverse' ? 'flex-wrap-reverse' : 'flex-nowrap',
        className
      )}
      style={getBaseStyles(rest)}
    >
      {children}
    </div>
  );
}

export interface GridProps extends BasePrimitiveProps {
  columns?: React.CSSProperties['gridTemplateColumns'];
  rows?: React.CSSProperties['gridTemplateRows'];
}

export function Grid({
  children,
  className,
  columns,
  rows,
  ...rest
}: GridProps) {
  return (
    <div
      className={cn("grid w-full h-full", className)}
      style={{
        ...getBaseStyles(rest),
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
      }}
    >
      {children}
    </div>
  );
}

export interface TextProps extends BasePrimitiveProps {
  content?: string;
  color?: React.CSSProperties['color'];
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  textAlign?: React.CSSProperties['textAlign'];
  lineHeight?: React.CSSProperties['lineHeight'];
}

export function Text({
  children,
  className,
  content,
  color,
  fontSize,
  fontWeight,
  textAlign,
  lineHeight,
  ...rest
}: TextProps) {
  return (
    <div
      className={className}
      style={{
        ...getBaseStyles(rest),
        color,
        fontSize,
        fontWeight,
        textAlign,
        lineHeight,
      }}
    >
      {content}
      {children}
    </div>
  );
}

export interface ImageBasicProps extends BasePrimitiveProps {
  src: string;
  alt?: string;
  objectFit?: React.CSSProperties['objectFit'];
}

export function ImageBasic({
  children,
  className,
  src,
  alt,
  objectFit = 'cover',
  ...rest
}: ImageBasicProps) {
  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={getBaseStyles(rest)}
    >
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-full"
        style={{ objectFit }}
      />
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}

export interface ButtonBasicProps extends BasePrimitiveProps {
  text: string;
  url?: string;
  isEditing?: boolean;
}

export function ButtonBasic({
  children,
  className,
  text,
  url,
  isEditing,
  ...rest
}: ButtonBasicProps) {
  const content = (
    <>
      {text}
      {children}
    </>
  );

  const baseStyles = getBaseStyles(rest);

  if (url && !isEditing) {
    return (
      <a
        href={url}
        className={cn("inline-block w-full h-full text-center no-underline", className)}
        style={baseStyles}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={cn("w-full h-full border-none bg-transparent p-0 m-0 cursor-pointer text-inherit font-inherit", className)}
      style={baseStyles}
    >
      {content}
    </button>
  );
}
