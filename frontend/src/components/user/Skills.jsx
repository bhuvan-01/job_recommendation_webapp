import { Pencil, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Skills = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);

  console.log('user: ', user);
  const {
    profile: { skills: initialSkills = [] },
  } = user;
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      skills: initialSkills,
      newSkill: '',
    },
    onSubmit: (values) => {
      // console.log('Saved skills:', values.skills);

      updateUser({
        profile: {
          ...user.profile,
          skills: values.skills,
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

  const handleAddSkill = () => {
    const newSkill = formik.values.newSkill.trim();

    if (newSkill) {
      formik.setFieldValue('skills', [...formik.values.skills, newSkill]);
      formik.setFieldValue('newSkill', '');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = formik.values.skills.filter((_, i) => i !== index);
    formik.setFieldValue('skills', updatedSkills);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='mt-4 border p-4 md:p-8 rounded-md'>
      <div className='flex mb-2 justify-between items-center'>
        <h1 className='text-2xl'>Skills</h1>
        {isEditing ? null : (
          <Button variant='ghost' size='icon' onClick={handleEditClick}>
            <Pencil size={16} />
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id='skillsForm'
          className='flex flex-col'
          onSubmit={formik.handleSubmit}
        >
          <div className=''>
            <Label htmlFor='newSkill' className='mb-2 font-semibold'>
              Add Skill
            </Label>
            <div className='flex gap-2 items-center my-2'>
              <Input
                name='newSkill'
                value={formik.values.newSkill}
                onChange={formik.handleChange}
                placeholder='Add skill'
                className='p-2 border rounded'
              />
              <Button type='button' variant='outline' onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>
          {formik.touched.newSkill && formik.errors.newSkill ? (
            <div className='text-red-500 text-xs'>{formik.errors.newSkill}</div>
          ) : null}
          <div className='mt-2 flex flex-wrap gap-2 items-center'>
            {formik.values.skills.map((skill, index) => (
              <div
                key={index}
                className='flex items-center gap-2 justify-between bg-gray-100 rounded-full w-fit text-sm border p-1 px-2 pl-3'
              >
                <span>{skill}</span>
                <Button
                  type='button'
                  variant='ghost'
                  className='p-1 hover:bg-white rounded-full w-6 h-6 flex justify-center items-center'
                  onClick={() => handleRemoveSkill(index)}
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
          {initialSkills.length > 0
            ? initialSkills.map((skill, index) => (
                <div
                  key={index}
                  className='bg-gray-100 rounded-full w-fit text-xs border p-1 px-3'
                >
                  <span>{skill}</span>
                </div>
              ))
            : 'No skills found'}
        </div>
      )}
    </section>
  );
};

export default Skills;
