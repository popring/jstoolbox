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

  // fill {key}
  const filledUrl = url.replace(/\{(\w+)\}/g, (_, key) => {
    if (params && key in params) {
      return params[key];
    }
  });

  return fetch(`http://localhost:3000${filledUrl}`, payload).then((res) => {
    return res.json();
  });
}
