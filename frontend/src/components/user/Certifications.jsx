import { Pencil, Check, X, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const Certifications = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { certifications: initialCertifications = [] } = user.profile;
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      certifications: initialCertifications,
      newCertification: {
        title: '',
        issuer: '',
        date: '',
        description: '',
        url: '', // Add URL field
      },
    },
    validationSchema: Yup.object().shape({
      newCertification: Yup.object().shape({
        title: Yup.string().required('Title is required'),
        issuer: Yup.string().required('Issuer is required'),
        date: Yup.string().required('Date is required'),
        description: Yup.string(),
        url: Yup.string().url('Invalid URL'), // Validate URL field
      }),
    }),
    onSubmit: (values) => {
      if (editingIndex !== null) {
        // Update existing certification
        const updatedCertifications = formik.values.certifications.map(
          (cert, index) => {
            return index === editingIndex
              ? formik.values.newCertification
              : cert;
          }
        );
        formik.setFieldValue('certifications', updatedCertifications);

        updateUser({
          profile: {
            ...user.profile,
            certifications: updatedCertifications,
          },
        });
      } else {
        // Add new certification
        const updatedCertificates = [
          ...formik.values.certifications,
          formik.values.newCertification,
        ];
        formik.setFieldValue('certifications', updatedCertificates);
        updateUser({
          profile: {
            ...user.profile,
            certifications: updatedCertificates,
          },
        });
      }

      formik.setFieldValue('newCertification', {
        title: '',
        issuer: '',
        date: '',
        description: '',
        url: '', // Reset URL field
      });
      setEditingIndex(null);
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleAddClick = () => {
    setEditingIndex(null);
    formik.setFieldValue('newCertification', {
      title: '',
      issuer: '',
      date: '',
      description: '',
      url: '', // Reset URL field
    });
    setIsEditing(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    formik.setFieldValue(
      'newCertification',
      formik.values.certifications[index]
    );
    setIsEditing(true);
  };

  const handleRemoveCertification = (index) => {
    const updatedCertifications = formik.values.certifications.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('certifications', updatedCertifications);

    updateUser({
      profile: {
        ...user.profile,
        certifications: updatedCertifications,
      },
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    formik.setFieldValue('newCertification', {
      title: '',
      issuer: '',
      date: '',
      description: '',
      url: '', // Reset URL field
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='mt-4 border p-4 md:p-8 rounded-md'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>Certifications & Awards</h1>
        {isEditing ? null : (
          <Button onClick={handleAddClick} variant='ghost'>
            Add
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id='certificationForm'
          className='flex flex-col'
          onSubmit={formik.handleSubmit}
        >
          {/* title */}
          <div className='md:flex gap-4'>
            <div className='mb-2 md:mb-4 basis-1/2'>
              <Label htmlFor='title' className='mb-2 font-semibold'>
                Title
              </Label>
              <Input
                name='newCertification.title'
                value={formik.values.newCertification.title}
                onChange={formik.handleChange}
                placeholder='Title'
                className='p-2 border rounded'
              />
              {formik.touched.newCertification?.title &&
                formik.errors.newCertification?.title && (
                  <div className='text-red-500 text-xs'>
                    {formik.errors.newCertification.title}
                  </div>
                )}
            </div>

            {/* issuer */}
            <div className='mb-2 md:mb-4 basis-1/2'>
              <Label htmlFor='issuer' className='mb-2 font-semibold'>
                Issuer
              </Label>
              <Input
                name='newCertification.issuer'
                value={formik.values.newCertification.issuer}
                onChange={formik.handleChange}
                placeholder='Issuer'
                className='p-2 border rounded'
              />
              {formik.touched.newCertification?.issuer &&
                formik.errors.newCertification?.issuer && (
                  <div className='text-red-500 text-xs'>
                    {formik.errors.newCertification.issuer}
                  </div>
                )}
            </div>
          </div>

          <div className='md:flex items-center gap-4 '>
            {/* date */}
            <div className='mb-2 md:mb-4 basis-1/2'>
              <Label htmlFor='date' className='mb-2 font-semibold'>
                Date
              </Label>
              <Input
                type='date'
                name='newCertification.date'
                value={formik.values.newCertification.date}
                onChange={formik.handleChange}
                placeholder='Date'
                className='p-2 border rounded'
              />
              {formik.touched.newCertification?.date &&
                formik.errors.newCertification?.date && (
                  <div className='text-red-500 text-xs'>
                    {formik.errors.newCertification.date}
                  </div>
                )}
            </div>
            {/* url */}
            <div className='mb-2 md:mb-4 basis-1/2'>
              <Label htmlFor='url' className='mb-2 font-semibold'>
                URL
              </Label>
              <Input
                name='newCertification.url'
                value={formik.values.newCertification.url}
                onChange={formik.handleChange}
                placeholder='URL'
                className='p-2 border rounded'
              />
              {formik.touched.newCertification?.url &&
                formik.errors.newCertification?.url && (
                  <div className='text-red-500 text-xs'>
                    {formik.errors.newCertification.url}
                  </div>
                )}
            </div>
          </div>

          {/* description */}
          <div className='mb-4'>
            <Label htmlFor='description' className='mb-2 font-semibold'>
              Description
            </Label>
            <Textarea
              name='newCertification.description'
              value={formik.values.newCertification.description}
              onChange={formik.handleChange}
              placeholder='Description'
              className='p-2 border rounded'
            ></Textarea>
            {formik.touched.newCertification?.description &&
              formik.errors.newCertification?.description && (
                <div className='text-red-500 text-xs'>
                  {formik.errors.newCertification.description}
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
          {formik.values.certifications.length > 0 ? (
            formik.values.certifications.map((cert, index) => (
              <div key={index} className='border p-4 rounded-md mb-2'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-semibold'>{cert.title}</h2>
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
                      onClick={() => handleRemoveCertification(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <p className='text-gray-600 font-medium'>{cert.issuer}</p>
                <p className='text-gray-600'>{cert.description}</p>
                <p className='text-gray-600 text-xs'>
                  {new Date(cert.date).toLocaleDateString()}
                </p>
                {cert.url && (
                  <p className='text-blue-500 mt-2'>
                    <a
                      href={cert.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2'
                    >
                      View Certification <ExternalLink size={16} />
                    </a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No certifications or awards entries yet.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Certifications;
