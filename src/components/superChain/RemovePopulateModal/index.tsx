import { Box, Button, Dialog, Stack, SvgIcon, Typography } from '@mui/material'
import React, { type SyntheticEvent } from 'react'
import css from './styles.module.css'
import CopyAddressButton from '@/components/common/CopyAddressButton'
import ExplorerButton from '@/components/common/ExplorerButton'
import { zeroAddress } from 'viem'
import { REMOVE_POPULATE_INITIAL_STATE } from '@/components/common/SuperChainEOAS'
import BeautyCancel from '@/public/images/common/beauty-cancel.svg'

function RemovePopulateModal({
  context,
  onClose,
}: {
  context: typeof REMOVE_POPULATE_INITIAL_STATE
  onClose: () => void
}) {
  const stopPropagation = (e: SyntheticEvent) => e.stopPropagation()

  const handleAcceptInvitation = async () => {
    // const superChainSmartAccountContract = getWriteableSuperChainSmartAccount()
    // await superChainSmartAccountContract?.write.addOwnerWithThreshold([modalContext.safe, modalContext.newOwner])
    onClose()
  }

  return (
    <Dialog
      className={css.claimModal}
      open={context.open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding="36px 24px 36px 24px"
        justifyContent="center"
        alignItems="center"
        fontSize="48px"
      >
        <SvgIcon fontSize="inherit" component={BeautyCancel} inheritViewBox />
        <Typography id="modal-modal-title" fontSize={24} fontWeight={600}>
          Cancel invite
        </Typography>
        <Stack alignItems="center" spacing={1}>
          <Typography id="modal-modal-description" fontSize={16}>
            Are you sure you want to cancel your invite request?
          </Typography>
          <Stack alignItems="center" direction="row">
            <Typography id="modal-modal-description" fontSize={14}>
              {context.address}
            </Typography>
            <CopyAddressButton address={zeroAddress} />
            <ExplorerButton onClick={stopPropagation} />
          </Stack>
        </Stack>
      </Box>
      <Stack spacing={1} className={css.outsideButtonContainer} direction="row">
        <Button fullWidth color="background" onClick={onClose} variant="contained">
          No
        </Button>
        <Button fullWidth onClick={handleAcceptInvitation} variant="contained">
          Yes
        </Button>
      </Stack>
    </Dialog>
  )
}

export default RemovePopulateModal
