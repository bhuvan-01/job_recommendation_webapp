import { Pencil, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Achievements = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const {
    profile: { achievements: initialAchievements = [] },
  } = user;
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      achievements: initialAchievements,
      newAchievement: {
        title: '',
        description: '',
      },
    },
    validationSchema: Yup.object().shape({
      newAchievement: Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string(),
      }),
    }),
    onSubmit: (values) => {
      // console.log('values: ', values);
      if (editingIndex !== null) {
        // Update existing achievement
        const updatedAchievements = formik.values.achievements.map(
          (achievement, index) => {
            return index === editingIndex ? values.newAchievement : achievement;
          }
        );
        formik.setFieldValue('achievements', updatedAchievements);

        updateUser({
          profile: {
            ...user.profile,
            achievements: updatedAchievements,
          },
        });
      } else {
        // Add new achievement
        const updatedAchievements = [
          ...formik.values.achievements,
          values.newAchievement,
        ];
        formik.setFieldValue('achievements', updatedAchievements);

        updateUser({
          profile: {
            ...user.profile,
            achievements: updatedAchievements,
          },
        });
      }

      formik.setFieldValue('newAchievement', {
        title: '',
        description: '',
      });
      setEditingIndex(null);
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleAddClick = () => {
    setEditingIndex(null);
    formik.setFieldValue('newAchievement', {
      title: '',
      description: '',
    });
    setIsEditing(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    formik.setFieldValue('newAchievement', formik.values.achievements[index]);
    setIsEditing(true);
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = formik.values.achievements.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('achievements', updatedAchievements);

    updateUser({
      profile: {
        ...user.profile,
        achievements: updatedAchievements,
      },
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    formik.setFieldValue('newAchievement', {
      title: '',
      description: '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='mt-4 border p-4 md:p-8 rounded-md'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl flex gap-2 items-center'>Achievements</h1>
        {isEditing ? null : (
          <Button onClick={handleAddClick} variant='ghost'>
            Add
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id='achievementForm'
          className='flex flex-col'
          onSubmit={formik.handleSubmit}
        >
          <div className='mb-4'>
            <Label htmlFor='title' className='mb-2 font-semibold'>
              Title
            </Label>
            <Input
              name='newAchievement.title'
              value={formik.values.newAchievement.title}
              onChange={formik.handleChange}
              placeholder='Title'
              className='p-2 border rounded'
            />
            {formik.touched.newAchievement?.title &&
              formik.errors.newAchievement?.title && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newAchievement.title}
                </div>
              )}
          </div>

          <div className='mb-4'>
            <Label htmlFor='description' className='mb-2 font-semibold'>
              Description
            </Label>
            <Input
              name='newAchievement.description'
              value={formik.values.newAchievement.description}
              onChange={formik.handleChange}
              placeholder='Description'
              className='p-2 border rounded'
            />
            {formik.touched.newAchievement?.description &&
              formik.errors.newAchievement?.description && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newAchievement.description}
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
          {initialAchievements.length > 0 ? (
            initialAchievements.map((achievement, index) => (
              <div key={index} className='border p-4 rounded-md mb-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-semibold mb-2'>
                    {achievement.title}
                  </h2>
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
                      onClick={() => handleRemoveAchievement(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <p className='text-gray-600'>{achievement.description}</p>
              </div>
            ))
          ) : (
            <p>No achievements found</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Achievements;
