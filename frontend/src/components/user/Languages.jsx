import { Pencil, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Languages = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const {
    profile: { languages: initialLanguages = [] },
  } = user;
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      languages: initialLanguages,
      newLanguage: '',
    },
    // validationSchema: Yup.object().shape({
    //   // newLanguage: Yup.string().required('Language is required'),
    // }),
    onSubmit: (values) => {
      updateUser({
        profile: {
          ...user.profile,
          languages: values.languages,
        },
      });
      formik.resetForm();
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleAddLanguage = () => {
    const newLanguage = formik.values.newLanguage.trim();

    if (newLanguage) {
      formik.setFieldValue('languages', [
        ...formik.values.languages,
        newLanguage,
      ]);
      formik.setFieldValue('newLanguage', '');
    }
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = formik.values.languages.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('languages', updatedLanguages);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='my-4 border p-4 md:p-8 rounded-md'>
      <div className='flex mb-2 justify-between items-center'>
        <h1 className='text-2xl'>Languages</h1>
        {isEditing ? null : (
          <Button variant='ghost' size='icon' onClick={handleEditClick}>
            <Pencil size={16} />
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id='languagesForm'
          className='flex flex-col'
          onSubmit={formik.handleSubmit}
        >
          <div className=''>
            <Label htmlFor='newLanguage' className='mb-2 font-semibold'>
              Add Language
            </Label>
            <div className='flex gap-2 items-center my-2'>
              <Input
                name='newLanguage'
                value={formik.values.newLanguage}
                onChange={formik.handleChange}
                placeholder='Add language'
                className='p-2 border rounded'
              />
              <Button
                type='button'
                variant='outline'
                onClick={handleAddLanguage}
              >
                Add
              </Button>
            </div>
          </div>
          {formik.touched.newLanguage && formik.errors.newLanguage ? (
            <div className='text-red-500 text-xs'>
              {formik.errors.newLanguage}
            </div>
          ) : null}
          <div className='mt-2 flex flex-wrap gap-2 items-center'>
            {formik.values.languages.map((language, index) => (
              <div
                key={index}
                className='flex items-center gap-2 justify-between bg-gray-100 rounded-full w-fit text-sm border p-1 px-2 pl-3'
              >
                <span>{language}</span>
                <Button
                  type='button'
                  variant='ghost'
                  className='p-1 hover:bg-white rounded-full w-6 h-6 flex justify-center items-center'
                  onClick={() => handleRemoveLanguage(index)}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
          <Button type='submit' className='w-fit mt-4 ml-auto'>
            Save <Check size={16} />
          </Button>
        </form>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {initialLanguages.length > 0
            ? initialLanguages.map((language, index) => (
                <div
                  key={index}
                  className='bg-gray-100 rounded-full w-fit text-xs border p-1 px-3'
                >
                  <span>{language}</span>
                </div>
              ))
            : 'No languages found'}
        </div>
      )}
    </section>
  );
};

export default Languages;
