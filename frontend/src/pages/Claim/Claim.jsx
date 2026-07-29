import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/common/Button';

export default function Claim() {
  const { id } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [claimId, setClaimId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await api.claimItem({ itemId: id, ...data });
      if (result.success) {
        setClaimId(result.claimId);
        setSubmitted(true);
        toast.success('Claim submitted successfully.');
      }
    } catch {
      toast.error('Could not submit your claim. Please try again.');
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto w-full px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-surface border border-border rounded-2xl p-6 sm:p-8 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-text mb-2">Claim Submitted</h1>
          <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
            Your verification details have been submitted to the security desk. Please bring a valid photo ID when picking up the item.
          </p>

          <div className="bg-border-light rounded-xl p-4 mb-6">
            <p className="text-xs text-text-tertiary mb-1">Your reference number</p>
            <p className="text-lg font-mono font-bold text-text tracking-wider">{claimId}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/matches" className="flex-1">
              <Button variant="secondary" className="w-full">View Matches</Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to={`/item/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to item
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Verify & Claim</h1>
        </div>
        <p className="text-sm text-text-secondary mb-8 max-w-md">
          To prevent fraudulent claims, provide details that only the true owner would know — such as specific contents, markings, or serial numbers.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Verification details */}
          <div>
            <label htmlFor="claim-details" className="block text-sm font-medium text-text mb-1.5">
              Verification Details <span className="text-error">*</span>
            </label>
            <textarea
              id="claim-details"
              {...register('verificationDetails', {
                required: 'Please describe details only the owner would know',
              })}
              rows={4}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-y"
              placeholder="e.g., The wallet has a faded receipt from the campus bookstore inside the left pocket..."
            />
            {errors.verificationDetails && (
              <p className="mt-1 text-xs text-error" role="alert">{errors.verificationDetails.message}</p>
            )}
            <p className="mt-1 text-xs text-text-tertiary">
              Mention specific features not visible in any photos — contents, scratches, labels, etc.
            </p>
          </div>

          {/* Name and contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="claim-name" className="block text-sm font-medium text-text mb-1.5">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="claim-name"
                {...register('fullName', { required: 'Name is required' })}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                placeholder="Your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-error" role="alert">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="claim-id" className="block text-sm font-medium text-text mb-1.5">
                Student / Staff ID
              </label>
              <input
                id="claim-id"
                {...register('studentId')}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label htmlFor="claim-phone" className="block text-sm font-medium text-text mb-1.5">
              Phone Number <span className="text-error">*</span>
            </label>
            <input
              id="claim-phone"
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
              placeholder="Your contact number"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-error" role="alert">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
            {isSubmitting ? 'Submitting claim...' : 'Submit Claim'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
