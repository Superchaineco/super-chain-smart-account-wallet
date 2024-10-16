'use client'
import React from 'react'
import css from './styles.module.css'
import { Box, Button, Divider, Grid, IconButton, List, ListItem, ListItemText, SvgIcon } from '@mui/material'
import layoutCss from '@/components/new-safe/create/styles.module.css'
import ArrowForward from '@/public/images/common/right-arrow.svg'
import ArrowBack from '@/public/images/common/left-arrow.svg'
import { ImageData } from '@nouns/assets'
import type { StepRenderProps } from '@/components/new-safe/CardStepper/useCardStepper'
import type { NewSafeFormData } from '../..'
import NounsAvatar from '@/components/common/NounsAvatar'

const TRAIT_LIMITS = {
  head: { min: 0, max: ImageData.images.heads.length - 1 },
  body: { min: 0, max: ImageData.images.bodies.length - 1 },
  accessory: { min: 0, max: ImageData.images.accessories.length - 1 },
  glasses: { min: 0, max: ImageData.images.glasses.length - 1 },
  background: { min: 0, max: ImageData.bgcolors.length - 1 },
}

export type NounProps = {
  background: number
  body: number
  accessory: number
  head: number
  glasses: number
}
export const PART_MAP: { [key in keyof NounProps]: keyof typeof ImageData.images | 'bgcolors' } = {
  head: 'heads',
  body: 'bodies',
  accessory: 'accessories',
  glasses: 'glasses',
  background: 'bgcolors',
}

function Avatar({
  setStep,
  seed,
  setSeed,
  onSubmit,
  onBack,
  data,
}: {
  setStep: (step: number) => void
  seed: NounProps
  setSeed: React.Dispatch<React.SetStateAction<NounProps>>
} & StepRenderProps<NewSafeFormData>) {
  const handleNext = () => {
    onSubmit({
      ...data,
      seed,
    })
    setStep(2)
  }

  const handleBack = () => {
    onBack(data)
  }

  const handleChangeBodyPart = (part: keyof NounProps, delta: number) => {
    if (
      seed[part] + delta < TRAIT_LIMITS[part as keyof typeof TRAIT_LIMITS].min ||
      seed[part] + delta > TRAIT_LIMITS[part as keyof typeof TRAIT_LIMITS].max
    ) {
      return
    }
    setSeed((prev: NounProps) => {
      return {
        ...prev,
        [part]: prev[part] + delta,
      }
    })
  }

  return (
    <>
      <Box className={layoutCss.row}>
        <Grid container justifyContent="center" alignItems="center" spacing={2} columns={20} direction="row">
          <Grid xs={12} item>
            <NounsAvatar seed={seed} />
          </Grid>
          <Grid xs={8} item>
            <Box
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                margin: 'auto',
              }}
            >
              <List className={css.list} aria-label="Nouns categories">
                {['Head', 'Glasses', 'Body', 'Accessory', 'Background'].map((text, index) => (
                  <ListItem className={css['list-item']} key={text} disablePadding>
                    <IconButton
                      onClick={() => handleChangeBodyPart(text.toLowerCase() as keyof NounProps, -1)}
                      edge="start"
                    >
                      <SvgIcon
                        style={{
                          width: '7px',
                          height: '12px',
                          padding: '0px',
                        }}
                        inheritViewBox
                        component={ArrowBack}
                      />
                    </IconButton>
                    <ListItemText primary={text} sx={{ textAlign: 'center' }} />
                    <IconButton
                      onClick={() => handleChangeBodyPart(text.toLowerCase() as keyof NounProps, 1)}
                      edge="end"
                    >
                      <SvgIcon
                        style={{
                          width: '7px',
                          height: '12px',
                          padding: '0px',
                        }}
                        inheritViewBox
                        component={ArrowForward}
                      />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box className={layoutCss.row}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" gap={3}>
          <Button onClick={handleBack} data-testid="cancel-btn" variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            className={css.submit}
            color="secondary"
            data-testid="next-btn"
            onClick={handleNext}
            variant="contained"
            size="stretched"
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Avatar
