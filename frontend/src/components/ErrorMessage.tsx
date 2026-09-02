interface ErrorMessageProps {
  message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="errorMessage">
      <strong>Operation Failed</strong>
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage