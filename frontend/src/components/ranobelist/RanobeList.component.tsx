import { Box, Divider, List, ListItem, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ERanobeUrls } from '../../tools/enums/Services.enum'
import { IRanobe } from '../../tools/interfaces/API.interface'
import style from './RanobeList.module.scss'

interface Props {
  ranobeList: IRanobe[]
}

export default function RanobeListComponent(props: Props): JSX.Element {
  return (
    <List>
      {props.ranobeList.map((ranobe, index) => {
        return (
          <ListItem key={index} sx={{ display: 'block' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: '15px',
                width: '100%'
              }}
            >
              <Link
                className={style.link}
                to={`/ranobelibme/ranobe/${ranobe.href}?title=${ranobe.title}`}
              >
                <div className={style.wrap}>
                  <img
                    className={style.image}
                    src={`${ERanobeUrls.STATICLIB}/${ranobe.cover}`}
                    alt={ranobe.title}
                    loading="lazy"
                  />
                </div>

                <Typography variant="h6" color="textPrimary">
                  {ranobe.title}
                </Typography>
              </Link>
            </Box>

            <Divider variant="fullWidth" />
          </ListItem>
        )
      })}
    </List>
  )
}
