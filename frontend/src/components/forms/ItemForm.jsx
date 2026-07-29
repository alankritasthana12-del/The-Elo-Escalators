import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import ImageUpload from './ImageUpload';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../constants';
import api from '../../services/api';

export default function ItemForm({ type = 'lost' }) {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const isLost = type === 'lost';
  const title = isLost ? 'Report a Lost Item' : 'Report a Found Item';
  const subtitle = isLost
    ? 'Provide details about the item you lost. The more information you give, the better our AI can match it.'
    : 'Thank you for turning in a found item. Fill in the details so we can help match it with the owner.';

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) formData.append('image', imageFile);

      const submitFn = isLost ? api.reportLost : api.reportFound;
      const result = await submitFn(formData);

      toast.success(
        isLost
          ? 'Lost item reported successfully. We will look for matches.'
          : 'Found item reported. Our AI is analysing it now.'
      );

      // Navigate after a short pause for the toast
      setTimeout(() => {
        navigate(isLost ? '/matches' : '/matches');
      }, 800);
    } catch (err) {
      toast.error('Could not submit your report. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto w-full px-4 sm:px-0"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">{title}</h1>
        <p className="text-sm sm:text-base text-text-secondary">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <ImageUpload onChange={setImageFile} />

        {/* Title */}
        <div>
          <label htmlFor="item-title" className="block text-sm font-medium text-text mb-1.5">
            Item Name <span className="text-error">*</span>
          </label>
          <input
            id="item-title"
            {...register('title', { required: 'Please enter a name for the item' })}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            placeholder={isLost ? 'e.g., Black Casio Scientific Calculator' : 'e.g., Found Silver iPhone 15'}
          />
          {errors.title && <p className="mt-1 text-xs text-error" role="alert">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="item-desc" className="block text-sm font-medium text-text mb-1.5">
            Description
          </label>
          <textarea
            id="item-desc"
            {...register('description')}
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-y"
            placeholder="Any distinguishing features — brand, colour, marks, contents, stickers..."
          />
        </div>

        {/* Category + Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-category" className="block text-sm font-medium text-text mb-1.5">
              Category <span className="text-error">*</span>
            </label>
            <select
              id="item-category"
              {...register('category', { required: 'Please select a category' })}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-error" role="alert">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="item-date" className="block text-sm font-medium text-text mb-1.5">
              Date {isLost ? 'Lost' : 'Found'} <span className="text-error">*</span>
            </label>
            <input
              id="item-date"
              type="date"
              {...register('date', { required: 'Please select a date' })}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
            />
            {errors.date && <p className="mt-1 text-xs text-error" role="alert">{errors.date.message}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="item-location" className="block text-sm font-medium text-text mb-1.5">
            Location <span className="text-error">*</span>
          </label>
          <select
            id="item-location"
            {...register('location', { required: 'Please select a location' })}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          >
            <option value="">Where was it {isLost ? 'last seen' : 'found'}?</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <p className="mt-1 text-xs text-error" role="alert">{errors.location.message}</p>}
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </form>
    </motion.div>
  );
}
