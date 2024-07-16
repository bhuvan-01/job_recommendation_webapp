import { Pencil, Check, X, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Projects = () => {
  const { user, updateUser } = useUser();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { projects: initialProjects = [] } = user.profile;
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // New state to track the index of the project being edited

  const formik = useFormik({
    initialValues: {
      projects: initialProjects,
      newProject: {
        title: '',
        description: '',
        url: '',
        github: '',
      },
    },
    validationSchema: Yup.object().shape({
      newProject: Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        url: Yup.string().url('Invalid URL').required('URL is required'),
        github: Yup.string()
          .url('Invalid URL')
          .required('GitHub URL is required'),
      }),
    }),
    onSubmit: (values) => {
      if (editingIndex !== null) {
        // Update the existing project
        const updatedProjects = formik.values.projects.map((project, index) =>
          index === editingIndex ? { ...values.newProject } : project
        );
        formik.setFieldValue('projects', updatedProjects);

        updateUser({
          profile: {
            ...user.profile,
            projects: updatedProjects,
          },
        });
      } else {
        // Add a new project
        const updatedProject = [
          ...formik.values.projects,
          formik.values.newProject,
        ];
        formik.setFieldValue('projects', updatedProject);

        updateUser({
          profile: {
            ...user.profile,
            projects: updatedProject,
          },
        });
      }

      formik.setFieldValue('newProject', {
        title: '',
        description: '',
        url: '',
        github: '',
      });
      setEditingIndex(null);
      setIsEditing(false);
    },
    enableReinitialize: true,
  });

  const handleAddClick = () => {
    setEditingIndex(null);
    formik.setFieldValue('newProject', {
      title: '',
      description: '',
      url: '',
      github: '',
    });
    setIsEditing(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    formik.setFieldValue('newProject', formik.values.projects[index]);
    setIsEditing(true);
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = formik.values.projects.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue('projects', updatedProjects);

    updateUser({
      profile: {
        ...user.profile,
        projects: updatedProjects,
      },
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    formik.setFieldValue('newProject', {
      title: '',
      description: '',
      url: '',
      github: '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='mt-4 border p-4 md:p-8 rounded-md'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl mb-4'>Projects</h1>
        {isEditing ? null : (
          <Button variant='ghost' onClick={handleAddClick}>
            Add
          </Button>
        )}
      </div>
      {isEditing ? (
        <form
          id='projectsForm'
          className='flex flex-col'
          onSubmit={formik.handleSubmit}
        >
          <div className='mb-4'>
            <Label htmlFor='title' className='mb-2 font-semibold'>
              Project Title
            </Label>
            <Input
              name='newProject.title'
              value={formik.values.newProject.title}
              onChange={formik.handleChange}
              placeholder='Title'
              className='p-2 border rounded'
            />
            {formik.touched.newProject?.title &&
            formik.errors.newProject?.title ? (
              <div className='text-red-500 text-xs'>
                {formik.errors.newProject.title}
              </div>
            ) : null}
          </div>

          <div className='mb-4'>
            <Label htmlFor='description' className='mb-2 font-semibold'>
              Project Description (separate by comma)
            </Label>
            <Input
              name='newProject.description'
              value={formik.values.newProject.description.toString()}
              onChange={formik.handleChange}
              placeholder='Description'
              className='p-2 border rounded'
            />
            {formik.touched.newProject?.description &&
            formik.errors.newProject?.description ? (
              <div className='text-red-500 text-xs'>
                {formik.errors.newProject.description}
              </div>
            ) : null}
          </div>

          <div className='mb-4'>
            <Label htmlFor='url' className='mb-2 font-semibold'>
              Project URL
            </Label>
            <Input
              name='newProject.url'
              value={formik.values.newProject.url}
              onChange={formik.handleChange}
              placeholder='URL'
              className='p-2 border rounded'
            />
            {formik.touched.newProject?.url && formik.errors.newProject?.url ? (
              <div className='text-red-500 text-xs'>
                {formik.errors.newProject.url}
              </div>
            ) : null}
          </div>

          <div className='mb-4'>
            <Label htmlFor='github' className='mb-2 font-semibold'>
              GitHub URL
            </Label>
            <Input
              name='newProject.github'
              value={formik.values.newProject.github}
              onChange={formik.handleChange}
              placeholder='GitHub URL'
              className='p-2 border rounded'
            />
            {formik.touched.newProject?.github &&
            formik.errors.newProject?.github ? (
              <div className='text-red-500 text-xs'>
                {formik.errors.newProject.github}
              </div>
            ) : null}
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
        <div className='flex flex-wrap gap-2'>
          {initialProjects.length > 0
            ? initialProjects.map((project, index) => (
                <div key={index} className='w-full p-4 border rounded-md'>
                  <div className='w-full flex items-center justify-between'>
                    <h2 className='text-lg font-medium'>{project.title}</h2>
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
                        onClick={() => handleRemoveProject(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <ul className='text-sm list-disc pl-4'>
                      {project?.description
                        .toString()
                        .split(',')
                        .map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                    </ul>
                  </div>

                  <div className='flex items-center gap-4 mt-4'>
                    <a
                      href={project?.url}
                      className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border rounded-full px-4 py-1 text-sm'
                    >
                      Demo <ExternalLink size={16} />
                    </a>
                    <a
                      href={project?.github}
                      className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border rounded-full px-4 py-1 text-sm'
                    >
                      Code <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            : 'No projects found'}
        </div>
      )}
    </section>
  );
};

export default Projects;
