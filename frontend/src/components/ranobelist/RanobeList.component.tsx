import { Box, Divider, List, ListItem, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ERanobeUrls } from '../../tools/enums/Services.enum'
import { IRanobe } from '../../tools/responses/api.interface'
import style from './RanobeList.module.scss'

interface IListProps {
  ranobeList: IRanobe[]
}

export default function RanobeListComponent(props: IListProps): JSX.Element {
  return (
    <List>
      {props.ranobeList.map((ranobe, index) => {
        return (
          <>
            <ListItem>
              <Box
                sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}
                key={index}
              >
                <Link
                  className={style.link}
                  to={`/ranobelibme/${ranobe.href}?title=${ranobe.title}`}
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
            </ListItem>

            <Divider variant="fullWidth" />
          </>
        )
      })}
    </List>
  )
}
