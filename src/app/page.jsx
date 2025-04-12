import { Button } from '@/components/ui/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
// import { Gradient } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import BentoGridDemo from '../components/bento-grid-Landing'
import FeaturesSection from '../components/features-section'
export const metadata = {
  description:
    'SkinCare AI helps you predict and analyze skin conditions from your images.',
}

function Hero() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset bg-gradient-to-custom sm:bg-gradient-to-custom-sm rounded-3xl" />
      <Container className="relative">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-16 pb-24 text-center sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="font-secondary text-5xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-7xl/[0.8] md:text-8xl">
            Unmask the{' '}
            <span
              className="bg-clip-text font-bold tracking-tight text-transparent"
              style={{ WebkitTextStroke: '1px #000' }}
            >
              Secrets
            </span>{' '}
            of Your Skin with AI!
          </h1>
          <p className="text-md mt-8 max-w-4xl font-medium text-gray-950/75 sm:text-2xl/8">
            Upload your skin image and let SkinCare AI analyze it for possible
            skin conditions and suggest treatment.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-2 sm:flex-row">
            <Button href="/upload">Let's Get started</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

function BentoSection() {
  return (
    <Container className="relative">
      <Subheading>FEATURES</Subheading>
      <Heading as="h3" className="mt-2 max-w-4xl">
        What do we have to Offer?
      </Heading>
      <FeaturesSection />
    </Container>
  )
}

function DarkBentoSection() {
  return (
    <div className="mx-2 mt-2 rounded-3xl bg-gray-900 py-32">
      <Container>
        <Subheading dark>STEPS</Subheading>
        <Heading as="h3" dark className="mt-2 mb-8 max-w-3xl text-white ">
          Detailed Insights About Your Skin Condition
        </Heading>
        <BentoGridDemo />
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">
          <BentoSection />
        </div>
        <DarkBentoSection />
      </main>
      <Footer />
    </div>
  )
}
