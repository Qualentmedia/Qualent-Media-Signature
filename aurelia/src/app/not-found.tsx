import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center py-section text-center">
      <div className="max-w-md">
        <p className="font-serif text-8xl text-gold">404</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">This page has slipped away.</h1>
        <p className="mt-4 text-sm text-graphite/75">
          The piece you are looking for may have been moved or is no longer with us.
          Let us guide you back.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/">Return home</Button>
          <Button href="/collections" variant="outline">Browse collections</Button>
        </div>
      </div>
    </Container>
  );
}
