class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  constructor(
    private baseUrl: string,
    private apiKey?: string,
  ) {}

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `API request failed: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data as T;
  }

  async get<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const searchParams = new URLSearchParams(params);
    if (this.apiKey) {
      searchParams.append("api_key", this.apiKey);
    }

    const url = `${this.baseUrl}${endpoint}?${searchParams.toString()}`;
    const response = await fetch(url);
    return this.handleResponse<T>(response);
  }
}
