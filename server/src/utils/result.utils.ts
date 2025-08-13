type Result<TData, TError = unknown> =
  | {
      ok: true;
      status: number;
      data: TData;
    }
  | {
      ok: false;
      status: number;
      error: TError;
    };

export const resultUtil = {
  success: <TData>(status = 200, data?: TData): Result<TData> => ({
    ok: true,
    status,
    data: data as TData,
  }),
  error: <TError = unknown>(
    status = 500,
    error: TError,
  ): Result<never, TError> => ({
    ok: false,
    status,
    error,
  }),
};
