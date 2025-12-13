import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <Mail className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to our Newsletter</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Get the latest updates on new products and upcoming sales. Plus, get a 10% discount on your first order!
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 text-lg bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
              />
              <Button size="lg" className="h-12 px-8 text-lg">
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
