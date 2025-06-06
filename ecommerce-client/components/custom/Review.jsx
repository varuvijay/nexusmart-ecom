import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Review() {
 const testimonials = [
  {
    quote:
      "NexuSmart has completely transformed my online shopping experience. The product quality is outstanding and delivery is always on time!",
    name: "Sarah Chen",
    designation: "Verified Customer",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Amazing customer service and incredible product variety. I've been shopping here for 2 years and never been disappointed!",
    name: "Michael Rodriguez",
    designation: "Premium Member",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The user interface is so intuitive and the checkout process is seamless. NexuSmart makes online shopping a pleasure!",
    name: "Emily Watson",
    designation: "Regular Shopper",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Outstanding deals and authentic products. The return policy is hassle-free and customer support is always helpful!",
    name: "James Kim",
    designation: "Loyal Customer",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Fast shipping, competitive prices, and excellent product quality. NexuSmart is now my go-to platform for all my shopping needs!",
    name: "Lisa Thompson",
    designation: "VIP Customer",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

  return <AnimatedTestimonials testimonials={testimonials} />;
}
