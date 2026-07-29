import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Camera, Cpu, ShieldCheck, ArrowRight, MapPin, FileSearch } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-primary mb-3"
          >
            AI-Powered Campus Recovery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight mb-4 sm:mb-5"
          >
            Lost Something?{' '}
            <span className="text-primary">Let AI Help You Find It.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 max-w-lg leading-relaxed"
          >
            Create an account to report lost or found items, receive intelligent match suggestions, and manage your recovery journey from one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium rounded-xl px-6 py-3 text-sm hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-surface text-text border border-border font-medium rounded-xl px-6 py-3 text-sm hover:bg-border-light transition-colors active:scale-[0.98]"
            >
              Log In
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-xs text-text-tertiary"
          >
            Track reports, discover AI matches, and manage your recovery activity.
          </motion.p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-xl sm:text-2xl font-bold text-text mb-2">How it works</h2>
          <p className="text-sm text-text-secondary mb-10 max-w-md">
            Four simple steps from losing an item to getting it back.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: '1',
                icon: MapPin,
                title: 'Report your item',
                desc: 'Describe what you lost or found — add a photo, location, and any details you remember.',
              },
              {
                step: '2',
                icon: Cpu,
                title: 'AI analyses it',
                desc: 'Our backend AI extracts visual features, reads text, and understands the description.',
              },
              {
                step: '3',
                icon: FileSearch,
                title: 'Find matches',
                desc: 'The system compares your report against all entries and surfaces the most likely matches.',
              },
              {
                step: '4',
                icon: ShieldCheck,
                title: 'Verify & recover',
                desc: 'Confirm ownership through our verification process and arrange to pick up your item.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeIn}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Step {item.step}</span>
                </div>
                <h3 className="font-semibold text-text mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-2">Key Features</h2>
        <p className="text-sm text-text-secondary mb-10 max-w-md">
          What makes this different from a traditional lost-and-found board.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: Cpu,
              title: 'AI-Powered Matching',
              desc: 'Semantic analysis of descriptions and images to find the highest-probability matches automatically.',
            },
            {
              icon: Search,
              title: 'Natural Language Search',
              desc: 'Search by typing what you lost in plain language — no complex filters required.',
            },
            {
              icon: Camera,
              title: 'Image Analysis',
              desc: 'Upload a photo and the AI identifies the object, brand, colour, and visible text.',
            },
            {
              icon: FileSearch,
              title: 'Smart Explanations',
              desc: 'Every match comes with clear reasons — same location, similar description, matching brand.',
            },
            {
              icon: ShieldCheck,
              title: 'Secure Claims',
              desc: 'Verification process ensures items go back to their rightful owners.',
            },
            {
              icon: MapPin,
              title: 'Campus-Focused',
              desc: 'Designed specifically for educational campuses with location-aware matching.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeIn}
              className="border border-border rounded-2xl p-5 bg-surface"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center mb-3">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-text text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-t border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-6 text-center">
            Platform Activity (Demo Data)
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: '128', label: 'Items Reported' },
              { value: '46', label: 'Items Recovered' },
              { value: '87%', label: 'Match Accuracy' },
              { value: '12', label: 'Active AI Matches' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-text">{stat.value}</p>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-3">Ready to find your item?</h2>
        <p className="text-sm text-text-secondary mb-8 max-w-md mx-auto">
          Start by reporting what you lost, or search the database using everyday language.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/report-lost"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium rounded-xl px-6 py-3 text-sm hover:bg-primary-dark transition-colors"
          >
            Report a Lost Item
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 bg-surface text-text border border-border font-medium rounded-xl px-6 py-3 text-sm hover:bg-border-light transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Database
          </Link>
        </div>
      </section>
    </div>
  );
}
