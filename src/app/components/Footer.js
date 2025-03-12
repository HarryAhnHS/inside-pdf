import { Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center text-sm">
          Built with ❤️ by
          <a
            href="https://github.com/harryahnhs"
            target="_blank"
            rel="noreferrer"
            className="ml-1 font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            HarryAhnHS
          </a>
          .
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full"
          >
            <a
              href="https://github.com/HarryAhnHS/playai-pdf-reader"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer