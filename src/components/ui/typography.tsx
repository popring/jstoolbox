import React from 'react';

type Params = { children: React.ReactNode };

export function TypographyH1(params: Params) {
  return (
    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
      {params.children}
    </h1>
  );
}

export function TypographyH3(params: Params) {
  return (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
      {params.children}
    </h3>
  );
}

export function TypographyP(params: Params) {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-3'>{params.children}</p>
  );
}

export function TypographyLarge(params: Params) {
  return <div className='text-lg font-semibold'>{params.children}</div>;
}
