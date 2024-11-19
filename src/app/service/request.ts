interface Options {
  method: 'GET' | 'POST';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}
export function request<T>(url: string, options: Options): Promise<T> {
  const { params } = options;
  const payload = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  // 动态填充 URL 中的占位符 {key}
  const filledUrl = url.replace(/\{(\w+)\}/g, (_, key) => {
    if (params && key in params) {
      return params[key];
    }
  });

  console.log(
    '%c [ filledUrl ]-27',
    'font-size:13px; background:#8c3152; color:#d07596;',
    filledUrl
  );
  return fetch(`http://localhost:3000${filledUrl}`, payload).then((res) => {
    return res.json();
  });
}
