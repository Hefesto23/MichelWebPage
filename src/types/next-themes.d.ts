declare module "next-themes" {
  export interface UseThemeProps {
    theme?: string | undefined;
    themes: string[];
    forcedTheme?: string | undefined;
    setTheme: (theme: string) => void;
    resolvedTheme?: string | undefined;
    systemTheme?: 'dark' | 'light' | undefined;
  }

  export interface ThemeProviderProps {
    children: React.ReactNode;
    themes?: string[];
    defaultTheme?: string;
    attribute?: string;
    value?: Record<string, string>;
    enableSystem?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
  }

  export function useTheme(): UseThemeProps;
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}