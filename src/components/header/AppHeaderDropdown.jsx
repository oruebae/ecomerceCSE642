import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { supabase } from '../../lib/supabase'
import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/productos/catalogo')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Administrador</CDropdownHeader>
        <CDropdownItem onClick={() => navigate('/productos/lista')}>
          Lista de Productos
        </CDropdownItem>
        <CDropdownItem onClick={() => navigate('/productos/agregar')}>
          Agregar Producto
        </CDropdownItem>
        <CDropdownItem onClick={() => navigate('/productos/catalogo')}>
          Ver Tienda Pública
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem
          as="button"
          type="button"
          className="text-danger fw-bold d-flex align-items-center"
          onClick={handleLogout}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
