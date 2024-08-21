import { useContext, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

import EnhancedTable from '@/components/common/EnhancedTable'
import type { AddressEntry } from '@/components/address-book/EntryDialog'
import EntryDialog from '@/components/address-book/EntryDialog'
import ExportDialog from '@/components/address-book/ExportDialog'
import ImportDialog from '@/components/address-book/ImportDialog'
import EditIcon from '@/public/images/common/edit.svg'
import DeleteIcon from '@/public/images/common/delete.svg'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import RemoveDialog from '@/components/address-book/RemoveDialog'
import EthHashInfo from '@/components/common/EthHashInfo'
import AddressBookHeader from '../AddressBookHeader'
import useAddressBook from '@/hooks/useAddressBook'
import Track from '@/components/common/Track'
import { ADDRESS_BOOK_EVENTS } from '@/services/analytics/events/addressBook'
import SvgIcon from '@mui/material/SvgIcon'
import PagePlaceholder from '@/components/common/PagePlaceholder'
import NoEntriesIcon from '@/public/images/address-book/no-entries.svg'
import { useCurrentChain } from '@/hooks/useChains'
import tableCss from '@/components/common/EnhancedTable/styles.module.css'
import { TxModalContext, type TxModalContextType } from '@/components/tx-flow'
import { TokenTransferFlow } from '@/components/tx-flow/flows'
import CheckWallet from '@/components/common/CheckWallet'
import madProps from '@/utils/mad-props'
import useContacts from '@/hooks/useContacts'
import { filter, includes } from 'lodash'
import NounsAvatar from '@/components/common/NounsAvatar'

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'address', label: 'Address' },
  { id: 'actions', label: '' },
]

export enum ModalType {
  EXPORT = 'export',
  IMPORT = 'import',
  ENTRY = 'entry',
  REMOVE = 'remove',
}

const defaultOpen = {
  [ModalType.EXPORT]: false,
  [ModalType.IMPORT]: false,
  [ModalType.ENTRY]: false,
  [ModalType.REMOVE]: false,
}

type AddressBookTableProps = {
  chain?: ChainInfo
  setTxFlow: TxModalContextType['setTxFlow']
}

function AddressBookTable({ chain, setTxFlow }: AddressBookTableProps) {
  const [open, setOpen] = useState<typeof defaultOpen>(defaultOpen)
  const [searchQuery, setSearchQuery] = useState('')
  const [defaultValues, setDefaultValues] = useState<AddressEntry | undefined>(undefined)

  const handleOpenModal = (type: keyof typeof open) => () => {
    setOpen((prev) => ({ ...prev, [type]: true }))
  }

  const handleOpenModalWithValues = (modal: ModalType, address: string, name: string) => {
    setDefaultValues({ address, name })
    handleOpenModal(modal)()
  }

  const handleClose = () => {
    setOpen(defaultOpen)
    setDefaultValues(undefined)
  }

  const addressBook = useAddressBook()
  const contacts = useContacts()
  const mergedEntries = useMemo(() => {
    return Object.keys(addressBook).reduce((acc, address) => {
      const addressBookEntry = addressBook[address] as any
      const contactEntry = contacts[address] as any
      if (contacts[address]) {
        acc[address] = {
          ...addressBookEntry,
          ...contactEntry,
        }
      } else {
        acc[address] = addressBook[address]
      }
      return acc
    }, {} as { [key: string]: any })
  }, [addressBook, contacts])
  const mergedEntriesArray = Object.entries(mergedEntries)
  const filteredEntries = useMemo(() => {
    if (!searchQuery) {
      return mergedEntriesArray
    }

    const query = searchQuery.toLowerCase()
    return mergedEntriesArray.filter(([address, value]) => {
      const name = typeof value === 'string' ? value : value.name
      return address.toLowerCase().includes(query) || name.toLowerCase().includes(query)
    })
  }, [mergedEntriesArray, searchQuery])

  const rows = filteredEntries.map(([address, value]) => {
    const name = typeof value === 'string' ? value : value.name

    return {
      cells: {
        name: {
          rawValue: name,
          content: name,
        },
        address: {
          rawValue: address,
          content:
            typeof value === 'object' && value.superChainAccount ? (
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-start">
                <Box width="40px" borderRadius="6px">
                  <NounsAvatar seed={value.superChainAccount.nounSeed} />
                </Box>
                <EthHashInfo
                  showAvatar={false}
                  address={address}
                  showName={false}
                  shortAddress={false}
                  hasExplorer
                  showCopyButton
                  customAddressElement={<Typography>{value.superChainAccount.id}</Typography>}
                />
              </Stack>
            ) : (
              <EthHashInfo address={address} showName={false} shortAddress={false} hasExplorer showCopyButton />
            ),
        },
        actions: {
          rawValue: '',
          sticky: true,
          content: (
            <div className={tableCss.actions}>
              <Track {...ADDRESS_BOOK_EVENTS.EDIT_ENTRY}>
                <Tooltip title="Edit entry" placement="top">
                  <IconButton onClick={() => handleOpenModalWithValues(ModalType.ENTRY, address, name)} size="small">
                    <SvgIcon component={EditIcon} inheritViewBox color="border" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Track>

              <Track {...ADDRESS_BOOK_EVENTS.DELETE_ENTRY}>
                <Tooltip title="Delete entry" placement="top">
                  <IconButton onClick={() => handleOpenModalWithValues(ModalType.REMOVE, address, name)} size="small">
                    <SvgIcon component={DeleteIcon} inheritViewBox color="error" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Track>

              <CheckWallet>
                {(isOk) => (
                  <Track {...ADDRESS_BOOK_EVENTS.SEND}>
                    <Button
                      data-testid="send-btn"
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setTxFlow(<TokenTransferFlow recipient={address} />)}
                      disabled={!isOk}
                    >
                      Send
                    </Button>
                  </Track>
                )}
              </CheckWallet>
            </div>
          ),
        },
      },
    }
  })
  return (
    <>
      <AddressBookHeader
        handleOpenModal={handleOpenModal}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <main>
        {filteredEntries.length > 0 ? (
          <EnhancedTable rows={rows} headCells={headCells} mobileVariant />
        ) : (
          <Box bgcolor="background.paper" borderRadius={1}>
            <PagePlaceholder
              img={<NoEntriesIcon />}
              text={`No entries found${chain ? ` on ${chain.chainName}` : ''}`}
            />
          </Box>
        )}
      </main>

      {open[ModalType.EXPORT] && <ExportDialog handleClose={handleClose} />}

      {open[ModalType.IMPORT] && <ImportDialog handleClose={handleClose} />}

      {open[ModalType.ENTRY] && (
        <EntryDialog
          handleClose={handleClose}
          defaultValues={defaultValues}
          disableAddressInput={Boolean(defaultValues?.name)}
        />
      )}

      {open[ModalType.REMOVE] && <RemoveDialog handleClose={handleClose} address={defaultValues?.address || ''} />}
    </>
  )
}

const useSetTxFlow = () => useContext(TxModalContext).setTxFlow

export default madProps(AddressBookTable, {
  chain: useCurrentChain,
  setTxFlow: useSetTxFlow,
})
