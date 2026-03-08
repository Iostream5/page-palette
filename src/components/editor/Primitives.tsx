import React from 'react';
import { cn } from '@/lib/utils';

export interface PrimitiveProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Box({ children, className, style }: PrimitiveProps) {
  return (
    <div className={cn("w-full h-full", className)} style={style}>
      {children}
    </div>
  );
}

export function Flex({
  children,
  className,
  style,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap'
}: PrimitiveProps & {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}) {
  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapMap = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  return (
    <div
      className={cn(
        "flex w-full h-full",
        direction === 'column' ? 'flex-col' : 'flex-row',
        alignMap[align] || 'items-stretch',
        justifyMap[justify] || 'justify-start',
        wrapMap[wrap] || 'flex-nowrap',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function Grid({
  children,
  className,
  style,
  columns,
  rows,
  gap
}: PrimitiveProps & {
  columns?: string;
  rows?: string;
  gap?: string;
}) {
  return (
    <div
      className={cn("grid w-full h-full", className)}
      style={{
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gap,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function Text({
  children,
  className,
  style,
  content,
  color,
  fontSize,
  fontWeight,
  textAlign,
  lineHeight
}: PrimitiveProps & {
  content?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
}) {
  return (
    <div
      className={className}
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign,
        lineHeight,
        ...style
      }}
    >
      {content}
      {children}
    </div>
  );
}

export function ImageBasic({
  children,
  className,
  style,
  src,
  alt,
  objectFit = 'cover'
}: PrimitiveProps & {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}) {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)} style={style}>
      <img
        src={src}
        alt={alt || ""}
        className="w-full h-full"
        style={{ objectFit }}
      />
      {children && (
        <div className="absolute inset-0">
          {children}
        </div>
      )}
    </div>
  );
}

export function ButtonBasic({
  children,
  className,
  style,
  text,
  url,
  onClick
}: PrimitiveProps & {
  text?: string;
  url?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {text}
      {children}
    </>
  );

  if (url) {
    return (
      <a
        href={url}
        className={cn("inline-block w-full h-full text-center no-underline", className)}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={cn("w-full h-full border-none bg-transparent p-0 m-0 cursor-pointer text-inherit font-inherit", className)}
      style={style}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
