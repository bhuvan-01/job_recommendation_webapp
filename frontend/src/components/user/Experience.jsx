import { Pencil, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Experience = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { experience: initialExperience = [] } = user.profile;
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      experience: initialExperience,
      newExperience: {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    },
    validationSchema: Yup.object().shape({
      newExperience: Yup.object().shape({
        company: Yup.string().required('Company is required'),
        role: Yup.string().required('Role is required'),
        startDate: Yup.string().required('Start date is required'),
        endDate: Yup.string(),
        description: Yup.string(),
      }),
    }),
    onSubmit: (values) => {
      if (editingIndex !== null) {
        // Update existing experience
        const updatedExperience = formik.values.experience.map((exp, index) => {
          console.log(index === editingIndex);
          return index === editingIndex ? formik.values.newExperience : exp;
        });
        formik.setFieldValue('experience', updatedExperience);

        updateUser({
          profile: {
            ...user.profile,
            experience: updatedExperience,
          },
        });
      } else {
        // Add new experience
        const updatedExperiences = [
          ...formik.values.experience,
          values.newExperience,
        ];
        formik.setFieldValue('experience', updatedExperiences);
        updateUser({
          profile: {
            ...user.profile,
            experience: updatedExperiences,
          },
        });
      }

      formik.setFieldValue('newExperience', {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      });
      setEditingIndex(null);
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleAddClick = () => {
    setEditingIndex(null);
    formik.setFieldValue('newExperience', {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsEditing(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    formik.setFieldValue('newExperience', formik.values.experience[index]);
    setIsEditing(true);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = formik.values.experience.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('experience', updatedExperience);

    updateUser({
      profile: {
        ...user.profile,
        experience: updatedExperience,
      },
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    formik.setFieldValue('newExperience', {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='mt-4 border p-4 md:p-8 rounded-md'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>Experience</h1>
        {isEditing ? null : (
          <Button variant='ghost' onClick={handleAddClick}>
            Add
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id='experienceForm'
          className='flex flex-col'
          onSubmit={formik.handleSubmit}
        >
          <div className='mb-4'>
            <Label htmlFor='company' className='mb-2 font-semibold'>
              Company
            </Label>
            <Input
              name='newExperience.company'
              value={formik.values.newExperience.company}
              onChange={formik.handleChange}
              placeholder='Company'
              className='p-2 border rounded'
            />
            {formik.touched.newExperience?.company &&
              formik.errors.newExperience?.company && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newExperience.company}
                </div>
              )}
          </div>

          <div className='mb-4'>
            <Label htmlFor='role' className='mb-2 font-semibold'>
              Role
            </Label>
            <Input
              name='newExperience.role'
              value={formik.values.newExperience.role}
              onChange={formik.handleChange}
              placeholder='Role'
              className='p-2 border rounded'
            />
            {formik.touched.newExperience?.role &&
              formik.errors.newExperience?.role && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newExperience.role}
                </div>
              )}
          </div>

          <div className='mb-4'>
            <Label htmlFor='startDate' className='mb-2 font-semibold'>
              Start Date
            </Label>
            <Input
              type='date'
              name='newExperience.startDate'
              value={formik.values.newExperience.startDate}
              onChange={formik.handleChange}
              placeholder='Start Date'
              className='p-2 border rounded'
            />
            {formik.touched.newExperience?.startDate &&
              formik.errors.newExperience?.startDate && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newExperience.startDate}
                </div>
              )}
          </div>

          <div className='mb-4'>
            <Label htmlFor='endDate' className='mb-2 font-semibold'>
              End Date
            </Label>
            <Input
              type='date'
              name='newExperience.endDate'
              value={formik.values.newExperience.endDate}
              onChange={formik.handleChange}
              placeholder='End Date'
              className='p-2 border rounded'
            />
            {formik.touched.newExperience?.endDate &&
              formik.errors.newExperience?.endDate && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newExperience.endDate}
                </div>
              )}
          </div>

          <div className='mb-4'>
            <Label htmlFor='description' className='mb-2 font-semibold'>
              Description
            </Label>
            <Input
              name='newExperience.description'
              value={formik.values.newExperience.description}
              onChange={formik.handleChange}
              placeholder='Description'
              className='p-2 border rounded'
            />
            {formik.touched.newExperience?.description &&
              formik.errors.newExperience?.description && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newExperience.description}
                </div>
              )}
          </div>

          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='destructive'
              onClick={handleCancel}
              className='flex items-center gap-2'
            >
              Cancel <X size={16} />
            </Button>

            <Button type='submit' className='w-fit flex items-center gap-2'>
              {editingIndex !== null ? 'Update' : 'Save'} <Check size={16} />
            </Button>
          </div>
        </form>
      ) : (
        <div>
          {formik.values.experience.length > 0 ? (
            formik.values.experience.map((exp, index) => (
              <div key={index} className='border p-4 rounded-md mb-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-semibold'>{exp.company}</h2>

                  <div className='flex items-center gap-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEditClick(index)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleRemoveExperience(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <p className='text-gray-600 font-medium'>{exp.role}</p>

                <p className='text-gray-600'>{exp.description}</p>
                <p className='text-gray-600 text-xs mt-1'>
                  {new Date(exp.startDate).toLocaleDateString()} -{' '}
                  {new Date(exp.endDate).toLocaleDateString() || 'Present'}
                </p>
              </div>
            ))
          ) : (
            <p>No experience entries yet.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Experience;
