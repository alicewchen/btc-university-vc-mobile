import { Component, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class InstructorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Instructor component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {this.state.error?.message || "An unexpected error occurred in the instructor dashboard."}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              variant="outline"
              className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/20"
              data-testid="button-retry-component"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default InstructorErrorBoundary;