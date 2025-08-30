import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import {
  FiUser,
  FiMail,
  FiPhoneIncoming,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHome,
  FiHeart,
  FiAtSign,
  FiFileText,
  FiCalendar,
} from 'react-icons/fi';
import UserAvatar from '../assets/user.png';
import CertificateIcon from '../assets/winner.png';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ReactJson from 'react-json-view';
import './formOne.css';

const genders = ['male', 'female', 'others'];
const professions = [
  { key: 'STUDENT', textLabel: 'Student' },
  { key: 'PRIVATE_EMPLOYEE', textLabel: 'Private Employee' },
  { key: 'GOVERMENT_EMPLOYEE', textLabel: 'Goverment Employee' },
];
const languages = ['english', 'hindi', 'bengali'];
const domains = [
  { key: 'PHP', textLabel: 'PHP with MySQL, Laravel' },
  { key: 'ASP.NET', textLabel: 'ASP.NET with C#' },
  { key: 'NODE JS', textLabel: 'Node Js with MongoDB, Express Js, Nest Js' },
  { key: 'REACT JS', textLabel: 'React Js, Next Js, TypeScript' },
  { key: 'ANGULAR JS', textLabel: 'Angular Js, TypeScript' },
  { key: 'VUE JS', textLabel: 'Vue Js, Vuelidate, Vuex, Vuetify' },
  { key: 'PYTHON', textLabel: 'Python, Pip, Django, Fast Api, Flux' },
];
const experiences = [
  { key: '1-3', textLabel: '1 to 3 Years' },
  { key: '3-5', textLabel: '3 to 5 Years' },
  { key: '5-8', textLabel: '5 to 8 Years' },
  { key: '8-12', textLabel: '8 to 12 Years' },
  { key: '12-16', textLabel: '12 to 16 Years' },
  { key: '16+', textLabel: '16+ Years' },
];

const FormOne = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsPrivacyModal, setShowTermsPrivacyModal] = useState(false);
  const [showFormDataModal, setShowFormDataModal] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [userCertificateImage, setUserCertificateImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    trigger,
    setFocus,
    clearErrors,
    formState: { errors, isDirty, isValid, isSubmitting, submitCount },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      fullAddress: '',
      userName: '',
      gender: '',
      profession: '',
      language: [],
      aboutYou: '',
      workingDomain: [],
      workingExperience: '',
      userDob: '',
      profileImage: null,
      certificateImage: null,
      acceptTermsCoditions: false,
      withMyConcern: true,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validateImageFile = (file) => {
    if (!file || !file[0]) return 'Image file is required';

    const currentFile = file[0];

    // ✅ MIME check
    if (!currentFile.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }

    // ✅ Extension check
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = currentFile.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return `Only ${allowedExtensions.join(', ')} files are allowed`;
    }

    return true;
  };

  const validateImageFileSize = (file) => {
    if (!file || !file[0]) return 'Image file is required';
    return file[0].size < 2 * 1024 * 1024 // 2MB
      ? true
      : 'Image file size should be less than 2MB';
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const allowedSize = 2 * 1024 * 1024; // 2MB
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // ✅ update react-hook-form state
    register('profileImage').onChange(e);

    // ✅ update preview
    if (
      file &&
      allowedExtensions.includes(fileExtension) &&
      file.size < allowedSize
    ) {
      setUserProfileImage(URL.createObjectURL(file));
      //setValue('profileImage', file, { shouldValidate: true, shouldDirty: true });
    } else {
      setUserProfileImage(null);
      //setValue('profileImage', null);
    }

    // ✅ trigger re-validation
    trigger('profileImage');
  };

  const handleCertificateImageChange = (e, field) => {
    const file = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const allowedSize = 2 * 1024 * 1024; // 2MB
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // ✅ update RHF value (very important)
    field.onChange(e.target.files);

    // ✅ update preview
    if (
      file &&
      allowedExtensions.includes(fileExtension) &&
      file.size < allowedSize
    ) {
      setUserCertificateImage(URL.createObjectURL(file));
    } else {
      setUserCertificateImage(null);
    }

    // ✅ trigger re-validation
    trigger('certificateImage');
  };

  const validateAge = (value) => {
    if (!value) return 'Please enter date of birth';

    const dob = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age >= 24 || 'Age must be at least 24 years old';
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;

    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const resetFormHandler = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // reset({}, { keepErrors: false }); // ✅ clears values & validation errors
        // reset(undefined, { keepErrors: false }); // ✅ resets back to defaultValues
        reset();
        setTimeout(() => setFocus('firstName'), 0);
        setUserProfileImage(null);
        setUserCertificateImage(null);
      }
    });
  };
  const submitButtonHandler = () => {
    document.getElementById('formSubmitBtn').click();
  };
  const onFormSubmit = (formData) => {
    //console.log(formData.profileImage[0]);
    console.log(formData);
    setIsLoading(true);
    toast.dismiss();
    Swal.fire({
      title: 'Please wait...',
      html: 'System is <strong>processing</strong> your request',
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setTimeout(() => {
      Swal.close();
      toast.success('Your form has been submitted successfully!');
      reset();
      setIsLoading(false);
      setFormData(formData);
      setUserProfileImage(null);
      setUserCertificateImage(null);
      setShowFormDataModal(true);
    }, 3000);
  };
  return (
    <>
      <Container>
        <Row className='mt-5 mb-5'>
          <Col md={{ span: 8, offset: 2 }}>
            <Card>
              <Card.Header className='text-center card-header'>
                <h3>React Form Validation - react-hook-form</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.firstName'>
                        <Form.Label>
                          First Name: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiUser />
                          </InputGroup.Text>
                          <Form.Control
                            type='text'
                            placeholder='First Name'
                            required
                            isInvalid={!!errors.firstName}
                            isValid={!errors.firstName && watch('firstName')}
                            {...register('firstName', {
                              required: 'Please enter first name',
                              minLength: {
                                value: 3,
                                message:
                                  'First name must be at least 3 characters',
                              },
                              maxLength: {
                                value: 20,
                                message:
                                  'First name cannot exceed 20 characters',
                              },
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: 'Please enter a valid first name',
                              },
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.firstName?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.lastName'>
                        <Form.Label>
                          Last Name: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiUser />
                          </InputGroup.Text>
                          <Form.Control
                            type='text'
                            placeholder='Last Name'
                            required
                            isInvalid={!!errors.lastName}
                            isValid={!errors.lastName && watch('lastName')}
                            {...register('lastName', {
                              required: 'Please enter last name',
                              minLength: {
                                value: 2,
                                message:
                                  'Last name must be at least 2 characters',
                              },
                              maxLength: {
                                value: 20,
                                message:
                                  'Last name cannot exceed 20 characters',
                              },
                              pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: 'Please enter a valid last name',
                              },
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.lastName?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.emailId'>
                        <Form.Label>
                          Email: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiMail />
                          </InputGroup.Text>
                          <Form.Control
                            type='email'
                            placeholder='Email'
                            required
                            isInvalid={!!errors.email}
                            isValid={!errors.email && watch('email')}
                            {...register('email', {
                              required: 'Please enter email',
                              maxLength: {
                                value: 60,
                                message: 'Email cannot exceed 60 characters',
                              },
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Please enter valid email',
                              },
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.email?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.phoneNumber'>
                        <Form.Label>
                          Mobile Number: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiPhoneIncoming />
                          </InputGroup.Text>
                          <Form.Control
                            type='tel'
                            placeholder='Mobile Number'
                            maxLength={10}
                            required
                            isInvalid={!!errors.mobileNumber}
                            isValid={
                              !errors.mobileNumber && watch('mobileNumber')
                            }
                            {...register('mobileNumber', {
                              required: 'Please enter mobile number',
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Please enter 10 digits mobile number',
                              },
                            })}
                            onInput={(e) =>
                              (e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ''
                              ))
                            }
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.mobileNumber?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.password'>
                        <Form.Label>
                          Password: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiLock />
                          </InputGroup.Text>
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            required
                            maxLength={20}
                            isInvalid={!!errors.password}
                            isValid={!errors.password && watch('password')}
                            {...register('password', {
                              required: 'Please set a password',
                              minLength: {
                                value: 8,
                                message:
                                  'Password must be at least 8 characters',
                              },
                              maxLength: {
                                value: 20,
                                message: 'Password cannot exceed 20 characters',
                              },
                              pattern: {
                                value:
                                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]).+$/,
                                message: 'Please set a strong password',
                              },
                            })}
                          />
                          <InputGroup.Text
                            style={{ cursor: 'pointer' }}
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type='invalid'>
                            {errors.password?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group
                        className='mb-3'
                        controlId='user.confirmPassword'
                      >
                        <Form.Label>
                          Confirm Password: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiLock />
                          </InputGroup.Text>
                          <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            maxLength={20}
                            isInvalid={!!errors.confirmPassword}
                            isValid={
                              !errors.confirmPassword &&
                              watch('confirmPassword')
                            }
                            {...register('confirmPassword', {
                              required: 'Please enter confirm password',
                              validate: (value) =>
                                value === watch('password') ||
                                'Confirm Password do not match',
                            })}
                          />
                          <InputGroup.Text
                            style={{ cursor: 'pointer' }}
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </InputGroup.Text>
                          <Form.Control.Feedback type='invalid'>
                            {errors.confirmPassword?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.fullAddress'>
                        <Form.Label>
                          Full Address: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiHome />
                          </InputGroup.Text>
                          <Form.Control
                            as='textarea'
                            rows={3}
                            required
                            maxLength={90}
                            placeholder='Full Address'
                            isInvalid={!!errors.fullAddress}
                            isValid={
                              !errors.fullAddress && watch('fullAddress')
                            }
                            {...register('fullAddress', {
                              required: 'Please enter full address',
                              minLength: {
                                value: 10,
                                message:
                                  'Address must be at least 10 characters',
                              },
                              maxLength: {
                                value: 90,
                                message: 'Address cannot exceed 90 characters',
                              },
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.fullAddress?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.userName'>
                        <Form.Label>
                          Username: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiAtSign />
                          </InputGroup.Text>
                          <Form.Control
                            type='text'
                            placeholder='Username'
                            required
                            isInvalid={!!errors.userName}
                            isValid={!errors.userName && watch('userName')}
                            {...register('userName', {
                              required: 'Please enter an username',
                              minLength: {
                                value: 6,
                                message:
                                  'Username must be at least 6 characters',
                              },
                              maxLength: {
                                value: 16,
                                message: 'Username cannot exceed 16 characters',
                              },
                              pattern: {
                                value:
                                  /^(?=.{6,16}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]*[a-zA-Z0-9]$/,
                                message: 'Please enter a valid username',
                              },
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.userName?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.gender'>
                        <Form.Label>
                          Gender: <em>*</em>
                        </Form.Label>

                        <div>
                          <Controller
                            name='gender'
                            control={control}
                            rules={{ required: 'Please select your gender' }}
                            render={({ field }) => (
                              <>
                                {genders.map((option, index) => (
                                  <Form.Check
                                    inline
                                    key={`gender-key${index}`}
                                    id={`gender_${option}`}
                                    type='radio'
                                    label={
                                      option.charAt(0).toUpperCase() +
                                      option.slice(1)
                                    }
                                    value={option}
                                    checked={field.value === option}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                  />
                                ))}
                              </>
                            )}
                          />
                        </div>
                        {errors.gender && (
                          <Form.Text className='text-danger'>
                            {errors.gender.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.profession'>
                        <Form.Label>
                          Profession: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiHeart />
                          </InputGroup.Text>
                          <Controller
                            name='profession'
                            control={control}
                            rules={{ required: 'Please select a profession' }}
                            render={({ field }) => (
                              <Form.Select
                                {...field}
                                isInvalid={!!errors.profession}
                                isValid={
                                  !errors.userName && watch('profession')
                                }
                              >
                                <option value='' disabled>
                                  -- Select Profession --
                                </option>
                                {professions.map((option, index) => (
                                  <option
                                    key={`profession-${index}`}
                                    id={`profession-${index}`}
                                    value={option.key}
                                  >
                                    {option.textLabel}
                                  </option>
                                ))}
                              </Form.Select>
                            )}
                          />
                        </InputGroup>
                        {errors.profession && (
                          <Form.Text className='text-danger'>
                            {errors.profession.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.language'>
                        <Form.Label>
                          Language (s): <em>*</em>
                        </Form.Label>

                        <div>
                          <Controller
                            name='language'
                            control={control}
                            rules={{
                              validate: (vals) =>
                                (vals && vals.length > 0) ||
                                'Please select language(s)',
                            }}
                            render={({ field }) => {
                              const selected = field.value || [];
                              return (
                                <>
                                  {languages.map((option, index) => (
                                    <Form.Check
                                      inline
                                      key={option}
                                      id={`lang_${index}`}
                                      type='checkbox'
                                      label={
                                        option.charAt(0).toUpperCase() +
                                        option.slice(1)
                                      }
                                      value={option}
                                      checked={selected.includes(option)}
                                      onChange={(e) => {
                                        const { checked } = e.target;
                                        const next = checked
                                          ? [...selected, option] // add
                                          : selected.filter(
                                              (v) => v !== option
                                            ); // remove
                                        field.onChange(next); // ✅ update RHF
                                      }}
                                    />
                                  ))}
                                </>
                              );
                            }}
                          />
                        </div>
                        {errors.language && (
                          <Form.Text className='text-danger'>
                            {errors.language.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.aboutYou'>
                        <Form.Label>
                          About You: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiFileText />
                          </InputGroup.Text>
                          <Form.Control
                            as='textarea'
                            rows={3}
                            required
                            placeholder='About Your Self'
                            maxLength={160}
                            isInvalid={!!errors.aboutYou}
                            isValid={!errors.aboutYou && watch('aboutYou')}
                            {...register('aboutYou', {
                              required: 'Please enter about your self',
                              minLength: {
                                value: 30,
                                message: 'It must be at least 30 characters',
                              },
                              maxLength: {
                                value: 160,
                                message: 'It cannot exceed 160 characters',
                              },
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.aboutYou?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group
                        className='mb-3'
                        controlId='user.workingDomain'
                      >
                        <Form.Label>
                          Working Domain (s): <em>*</em>
                        </Form.Label>

                        <div>
                          {domains.map((option, index) => (
                            <Form.Check
                              key={option.key}
                              id={`domain_${index}`}
                              type='checkbox'
                              label={option.textLabel}
                              value={option.key}
                              {...register('workingDomain', {
                                validate: (vals) =>
                                  (vals && vals.length > 0) ||
                                  'Please select your working domain(s)',
                              })}
                            />
                          ))}
                        </div>

                        {errors.workingDomain && (
                          <Form.Text className='text-danger'>
                            {errors.workingDomain.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group
                        className='mb-3'
                        controlId='user.workingExperience'
                      >
                        <Form.Label>
                          Working Experience: <em>*</em>
                        </Form.Label>

                        <div>
                          {experiences.map((option) => (
                            <Form.Check
                              key={option.key}
                              id={`experience-${option.key}`}
                              type='radio'
                              label={option.textLabel}
                              value={option.key}
                              {...register('workingExperience', {
                                required: 'Please select your experience',
                              })}
                            />
                          ))}
                        </div>

                        {errors.workingExperience && (
                          <Form.Text className='text-danger'>
                            {errors.workingExperience.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group className='mb-3' controlId='user.userDob'>
                        <Form.Label>
                          Date of Birth: <em>*</em>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FiCalendar />
                          </InputGroup.Text>
                          <Form.Control
                            type='date'
                            placeholder='DOB'
                            required
                            max={new Date().toISOString().split('T')[0]} // prevent future dates
                            isInvalid={!!errors.userDob}
                            isValid={!errors.userDob && watch('userDob')}
                            {...register('userDob', {
                              required: 'Please enter date of birth',
                              validate: validateAge,
                            })}
                          />
                          <Form.Control.Feedback type='invalid'>
                            {errors.userDob?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      {watch('userDob') && (
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            marginTop: '24px',
                          }}
                          className={`small ${
                            errors.userDob?.message
                              ? 'text-danger'
                              : 'text-success'
                          }`}
                        >
                          Current Age: {calculateAge(watch('userDob'))} years
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group
                        controlId='user.profileImage'
                        className='mb-3'
                      >
                        <Form.Label>
                          Profile Image: <em>*</em>
                        </Form.Label>
                        <div className='mb-2' style={{ width: '60px' }}>
                          <Image
                            src={userProfileImage || UserAvatar}
                            thumbnail
                          />
                        </div>
                        <Form.Control
                          type='file'
                          accept='image/*'
                          required
                          isInvalid={!!errors.profileImage}
                          isValid={
                            !errors.profileImage && watch('profileImage')
                          }
                          {...register('profileImage', {
                            required: 'Please upload profile image',
                            validate: {
                              validateImageFile,
                              validateImageFileSize,
                            },
                          })}
                          onChange={handleProfileImageChange}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.profileImage?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12} xs={12}>
                      <Form.Group
                        controlId='user.certificateImage'
                        className='mb-3'
                      >
                        <Form.Label>
                          Certificate Image: <em>*</em>
                        </Form.Label>
                        <div className='mb-2' style={{ width: '60px' }}>
                          <Image
                            src={userCertificateImage || CertificateIcon}
                            thumbnail
                          />
                        </div>
                        <Controller
                          control={control}
                          name='certificateImage'
                          rules={{
                            required: 'Please upload certificate image',
                            validate: {
                              validateImageFile,
                              validateImageFileSize,
                            },
                          }}
                          render={({ field }) => (
                            <Form.Control
                              type='file'
                              accept='image/*'
                              isInvalid={!!errors.certificateImage}
                              isValid={
                                !errors.certificateImage &&
                                watch('certificateImage')
                              }
                              onChange={(e) =>
                                handleCertificateImageChange(e, field)
                              }
                            />
                          )}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.certificateImage?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} sm={12} xs={12}>
                      <Form.Group
                        className='mb-3'
                        controlId='user.acceptTermsCoditions'
                      >
                        <Form.Check
                          type='checkbox'
                          label={
                            <>
                              I agree to the{' '}
                              <span
                                style={{
                                  color: '#0089bbff',
                                  cursor: 'pointer',
                                  textDecoration: 'none',
                                }}
                                onClick={() => setShowTermsPrivacyModal(true)}
                              >
                                Terms & Conditions, Privacy Policies
                              </span>
                            </>
                          }
                          {...register('acceptTermsCoditions', {
                            required:
                              'You must accept the Terms & Conditions, Privacy Policies',
                          })}
                          isInvalid={!!errors.acceptTermsCoditions}
                          feedback={errors.acceptTermsCoditions?.message} // ✅ show inline error
                          feedbackType='invalid' // ✅ make it red
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.acceptTermsCoditions?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12} sm={12} xs={12}>
                      <Form.Group
                        className='mb-3'
                        controlId='user.withMyConcern'
                      >
                        <Form.Check
                          type='checkbox'
                          label='I have provided all the information truthfully to the best of my knowledge and concerns.'
                          {...register('withMyConcern', {
                            required: 'You must accept it with your concern',
                          })}
                          isInvalid={!!errors.withMyConcern}
                          feedback={errors.withMyConcern?.message} // ✅ show inline error
                          feedbackType='invalid' // ✅ make it red
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.withMyConcern?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    as='input'
                    type='submit'
                    value='Submit'
                    id='formSubmitBtn'
                    className='d-none'
                  />
                </Form>
              </Card.Body>
              <Card.Footer className='d-flex justify-content-between'>
                <Button
                  type='button'
                  variant='primary'
                  onClick={submitButtonHandler}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        animation='border'
                        size='sm'
                        role='status'
                        className='me-2'
                      />
                      Please wait...
                    </>
                  ) : (
                    'Submit Form'
                  )}
                </Button>
                <Button
                  type='button'
                  variant='danger'
                  onClick={resetFormHandler}
                  disabled={!isDirty}
                >
                  Cancel
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ✅ Terms & Conditions, Privacy Policy Modal */}
      <Modal
        show={showTermsPrivacyModal}
        onHide={() => setShowTermsPrivacyModal(false)}
        centered
        backdrop='static'
        keyboard={false}
        size='lg'
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions / Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(() => {
            const elements = [];
            for (let i = 0; i < 25; i++) {
              elements.push(
                <p key={`tcpvmodal-ptxt-${i}`}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book...
                </p>
              );
            }
            return elements;
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowTermsPrivacyModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Display Form Data Modal */}
      <Modal
        show={showFormDataModal}
        onHide={() => setShowFormDataModal(false)}
        centered
        backdrop='static'
        keyboard={false}
        dialogClassName='blur-backdrop'
        size='lg'
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Form Submitted Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <pre
              style={{
                background: '#f4f4f4',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              {JSON.stringify(formData, null, 2)}
            </pre>
          )}
          <ReactJson src={formData} theme='monokai' collapsed={false} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowFormDataModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FormOne;
