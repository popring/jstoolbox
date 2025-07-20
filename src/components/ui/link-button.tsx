import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { ButtonProps } from './button';

interface LinkButtonProps extends Omit<ButtonProps, 'onClick'> {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}

export function LinkButton({ 
  href, 
  external = false, 
  children, 
  ...buttonProps 
}: LinkButtonProps) {
  // 判断是否为外部链接
  const isExternal = external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  
  const linkProps = isExternal ? {
    target: "_blank",
    rel: "noopener noreferrer",
    title: href // 添加 title 属性显示完整链接
  } : {};

  return (
    <Link href={href} {...linkProps}>
      <Button {...buttonProps}>
        {children}
      </Button>
    </Link>
  );
} 