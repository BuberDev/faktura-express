import { SignInPage, Testimonial } from "@/components/ui/sign-in";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Anna Kowalska",
    handle: "@annabiz",
    text: "Bardzo szybkie i intuicyjne narzędzie do pracy z fakturami.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Marek Nowak",
    handle: "@marekdev",
    text: "Świetny design i zero chaosu, wszystko jest dokładnie tam, gdzie powinno.",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Piotr Zieliński",
    handle: "@piotrfirma",
    text: "Wreszcie aplikacja, która wygląda premium i działa naprawdę sprawnie.",
  },
];

const SignInPageDemo = () => {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign In submitted:", data);
    alert("Logowanie wysłane. Szczegóły znajdziesz w konsoli przeglądarki.");
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    alert("Kliknięto logowanie przez Google");
  };

  const handleResetPassword = () => {
    alert("Kliknięto reset hasła");
  };

  const handleCreateAccount = () => {
    alert("Kliknięto utworzenie konta");
  };

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?auto=format&fit=crop&w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;
