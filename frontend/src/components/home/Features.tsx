import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { slideUp } from '@/lib/animations';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders over $100. Fast and reliable delivery worldwide.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure payment with Stripe. Your data is always protected.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day money-back guarantee. No questions asked returns.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team ready to help you around the clock.',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <motion.div 
                className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6"
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1,
                  transition: { duration: 0.6, ease: 'easeInOut' }
                }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <motion.h3 
                className="text-xl font-bold mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p 
                className="text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
