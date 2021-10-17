import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography
} from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import { KeyboardEvent, useContext } from 'react'
import { ERanobeUrls } from '../../tools/enums/Services.enum'
import { ISearchResponse } from '../../tools/responses/api.interface'
import { StoreContext } from '../../tools/store'
import { TSearchType } from '../../tools/types/ranobelibme/SearchType.type'

interface Props {
  title: string
  show: boolean
  closeEvent: () => void
  textFieldChange: (value: string) => void
  submit: () => void
  type: TSearchType
  typeChange: (type: TSearchType) => void
  result: ISearchResponse[]
}

export default function SearchComponent({
  title,
  show,
  closeEvent,
  textFieldChange,
  submit,
  type,
  typeChange,
  result
}: Props): JSX.Element {
  const onEnter = ($event: KeyboardEvent) => {
    if ($event.keyCode === 13) {
      submit()
    }
  }
  const store = useContext(StoreContext)
  const [loading] = store.loading

  return (
    <Dialog
      open={show}
      onClose={closeEvent}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        <Box display="flex" alignItems="center" mb="15px">
          <TextField
            label="Title"
            value={title}
            onChange={value => textFieldChange(value.target.value)}
            style={{ marginRight: 10 }}
            onKeyDown={onEnter}
          />
          <Button disabled={loading} onClick={submit}>
            Search
          </Button>
        </Box>

        <Box display="flex">
          <Button
            style={{
              marginRight: '10px',
              color: 'white',
              backgroundColor: type === 'manga' ? blue[800] : grey[700]
            }}
            onClick={() => typeChange('manga')}
          >
            Ranobe
          </Button>

          <Button
            style={{
              color: 'white',
              backgroundColor: type === 'user' ? blue[800] : grey[700]
            }}
            onClick={() => typeChange('user')}
          >
            User
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers={true}>
        {result.map((item, index) => {
          const temp = {
            title: '',
            src: ''
          }

          if (type === 'user') {
            temp.title = item.value
            temp.src = `${ERanobeUrls.RANOBELIBME}/uploads/users/${item.id}/${item.avatar}`
          } else if (type === 'manga') {
            temp.title = item.eng_name
            temp.src = item.covers.thumbnail
          }

          return (
            <div style={{ marginBottom: '20px' }}>
              <Box
                key={index}
                sx={{ display: 'flex', mb: '20px', alignItems: 'center' }}
              >
                <img
                  style={{ marginRight: '10px', display: 'block' }}
                  src={temp.src}
                />
                <Typography>{temp.title}</Typography>
              </Box>

              {index !== result.length - 1 && <Divider variant="fullWidth" />}
            </div>
          )
        })}
      </DialogContent>

      <DialogActions>
        <Button onClick={closeEvent} variant="text">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
