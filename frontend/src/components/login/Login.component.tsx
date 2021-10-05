import { grey } from '@material-ui/core/colors'
import { CloseOutlined } from '@material-ui/icons'
import { Box, Button, Grid, Modal, TextField } from '@mui/material'
import { createRef, CSSProperties, KeyboardEvent, useState } from 'react'
import { Controller, RegisterOptions, useForm } from 'react-hook-form'
import { ILoginForm } from '../../tools/interfaces/Ranobelibme.interface'
import LoginStyle from './Login.module.scss'

interface Props {
  show?: boolean
  style?: CSSProperties
  submit: (data: ILoginForm) => void
}

const passwordRules: RegisterOptions = {
  validate: password => {
    return password.length || 'password is required'
  }
}

export default function LoginComponent({
  show,
  style,
  submit
}: Props): JSX.Element {
  const [showModal, setShowModal] = useState(false)
  const buttonRef = createRef<HTMLButtonElement>()
  const {
    handleSubmit,
    formState: { errors: fieldsErrors },
    control
  } = useForm()

  const handleCloseModal = () => setShowModal(false)

  const onSubmit = (data: ILoginForm) => {
    submit(data)
  }
  const onError = (errors: unknown, e: unknown) => {
    console.log(errors, e)
  }

  const onEnter = ($event: KeyboardEvent) => {
    if ($event.keyCode === 13) {
      buttonRef.current?.click()
    }
  }

  return (
    <div style={style}>
      {show && (
        <Button variant="contained" onClick={() => setShowModal(true)}>
          Log in
        </Button>
      )}

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={LoginStyle.box} sx={{ backgroundColor: grey[900] }}>
          <Button
            onClick={handleCloseModal}
            className={LoginStyle.modalCloseButton}
            variant="text"
          >
            <CloseOutlined></CloseOutlined>
          </Button>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="email"
                render={({ field }) => (
                  <TextField
                    label="Email"
                    helperText={fieldsErrors?.email?.message}
                    value={field.value}
                    onChange={value => field.onChange(value)}
                    onKeyDown={onEnter}
                    error={!!fieldsErrors.email}
                  />
                )}
                control={control}
                defaultValue=""
                rules={passwordRules}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="password"
                render={({ field }) => (
                  <TextField
                    type="password"
                    label="Password"
                    helperText={fieldsErrors?.password?.message}
                    value={field.value}
                    onChange={value => field.onChange(value)}
                    onKeyDown={onEnter}
                    error={!!fieldsErrors.password}
                  />
                )}
                control={control}
                defaultValue=""
                rules={passwordRules}
              />
            </Grid>

            <Grid item xs={12}>
              <Button ref={buttonRef} onClick={handleSubmit(onSubmit, onError)}>
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  )
}
