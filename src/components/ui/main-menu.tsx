"use client"

import { Menubar,
         MenubarContent,
         MenubarItem,
         MenubarMenu,         
         MenubarSeparator,
         MenubarTrigger,
         MenubarSub,
         MenubarSubTrigger,
         MenubarSubContent } from '@/components/ui/menubar'
import { ThemeToggle } from './theme-toggle'
import { BarChart2Icon,
         BoxIcon,
         ClipboardIcon,
         DollarSignIcon,
         FileTextIcon,
         HomeIcon,
         LogOutIcon,
         MenuIcon,
         Search,
         Settings,
         ShieldIcon,
         UsersIcon } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import FourEasyIcon from '../FourEasyIcon'
import Link from 'next/link'

const MainMenu = () => {
  const { user, logout } = useUser()
  const { push } = useRouter()

  return (
      <Menubar className="flex flex-row justify-between w-full pl-0 sm:pr-0">
        { user ?
          <>
            {/* Menu completo visível em telas médias e grandes */}
            <div className="hidden sm:flex flex-row">
              <Link href="/dashboard" className="flex flex-row items-center ml-2">
                <FourEasyIcon height={30} width={30} />
                <span className="sr-only">4Easy Tecnologia</span>
              </Link>
              <MenubarMenu>
                <MenubarTrigger>Cadastros</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <UsersIcon className="mr-3" size={16}/> Clientes
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <BoxIcon className="mr-3" size={16}/> Produtos
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <DollarSignIcon className="mr-3" size={16}/> Condições de Pagamento
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <ClipboardIcon className="mr-3" size={16}/> Tabela de Preços
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <UsersIcon className="mr-3" size={16}/> Vendedores
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger>Movimentos</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileTextIcon className="mr-3" size={16}/> Compras
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => {
                        push('/movements/purchases/budget')
                      }}>
                        <ClipboardIcon className="mr-3" size={16}/> Orçamentos
                      </MenubarItem>
                      <MenubarItem onClick={() => {
                        push('/movements/purchases/order')
                      }}>
                        <ClipboardIcon className="mr-3" size={16}/> Ordem de compra
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileTextIcon className="mr-3" size={16}/> Serviços
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => {
                        // push('/movements/services/budget')
                      }}>
                        <ClipboardIcon className="mr-3" size={16}/> Orçamentos
                      </MenubarItem>
                      <MenubarItem onClick={() => {
                        // push('/movements/services/order')
                      }}>
                        <ClipboardIcon className="mr-3" size={16}/> Ordem de serviço
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger>Consultas</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <BoxIcon className="mr-3" size={16}/> Estoque
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        <ClipboardIcon className="mr-3" size={16}/> Movimentação dos Produtos
                      </MenubarItem>
                      <MenubarItem>
                        <ClipboardIcon className="mr-3" size={16}/> Saldo dos Produtos
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    <DollarSignIcon className="mr-3" size={16}/> Financeiro
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <BoxIcon className="mr-3" size={16}/> Produtos
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger>Relatórios</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <ClipboardIcon className="mr-3" size={16}/> Cadastros
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <BoxIcon className="mr-3" size={16}/> Estoque
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <BoxIcon className="mr-3" size={16}/> Equipamentos
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <BarChart2Icon className="mr-3" size={16}/> Faturamento
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <DollarSignIcon className="mr-3" size={16}/> Financeiro
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <ClipboardIcon className="mr-3" size={16}/> Produção 
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger>Ferramentas</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <ShieldIcon className="mr-3" size={16}/> Central de Segurança
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger>Sistema</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => {
                    logout()
                  }}>
                    <LogOutIcon className="mr-3" size={16}/> Logout
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </div>

            {/* Menu simplificado visível em telas pequenas */}
            <div className="flex sm:hidden">
              <MenubarMenu>
                <MenubarTrigger><MenuIcon size={24} /></MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => {
                    push('/dashboard')
                  }}>
                    <HomeIcon className="mr-3" size={16} /> Dashboard
                  </MenubarItem>                  
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <BoxIcon className="mr-3" size={16}/> Cadastros
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        <UsersIcon className="mr-3" size={16}/> Clientes
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <BoxIcon className="mr-3" size={16}/> Produtos
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <DollarSignIcon className="mr-3" size={16}/> Cond. de Pagamento
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <ClipboardIcon className="mr-3" size={16}/> Tabela de Preços
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <UsersIcon className="mr-3" size={16}/> Vendedores
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileTextIcon className="mr-3" size={16}/> Movimentos
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarSub>
                        <MenubarSubTrigger>
                          <FileTextIcon className="mr-3" size={16}/> Compras
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                          <MenubarItem onClick={() => {
                            push('/movements/purchases/budget')
                          }}>
                            <ClipboardIcon className="mr-3" size={16}/> Orçamentos
                          </MenubarItem>
                          <MenubarSeparator />
                          <MenubarItem onClick={() => {
                            push('/movements/purchases/order')
                          }}>
                            <ClipboardIcon className="mr-3" size={16}/> Ordem de compra
                          </MenubarItem>
                        </MenubarSubContent>
                      </MenubarSub>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <Search className="mr-3" size={16}/> Consultas
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarSub>
                        <MenubarSubTrigger>
                          <BoxIcon className="mr-3" size={16}/> Estoque
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                          <MenubarItem>
                            <ClipboardIcon className="mr-3" size={16}/> Movim. Produtos
                          </MenubarItem>
                          <MenubarSeparator />
                          <MenubarItem>
                            <ClipboardIcon className="mr-3" size={16}/> Saldo dos Produtos
                          </MenubarItem>
                        </MenubarSubContent>
                      </MenubarSub>
                      <MenubarSeparator />
                      <MenubarItem>
                        <DollarSignIcon className="mr-3" size={16}/> Financeiro
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <BoxIcon className="mr-3" size={16}/> Produtos
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <BoxIcon className="mr-3" size={16}/> Relatórios
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        <ClipboardIcon className="mr-3" size={16}/> Cadastros
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <BoxIcon className="mr-3" size={16}/> Estoque
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <BoxIcon className="mr-3" size={16}/> Equipamentos
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <BarChart2Icon className="mr-3" size={16}/> Faturamento
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <DollarSignIcon className="mr-3" size={16}/> Financeiro
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>
                        <ClipboardIcon className="mr-3" size={16}/> Produção
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <Settings className="mr-3" size={16}/> Ferramentas
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>
                        <ShieldIcon className="mr-3" size={16}/> Central de Segurança
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <BoxIcon className="mr-3" size={16}/> Sistema
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => {
                        logout()
                      }}>
                        <LogOutIcon className="mr-3" size={16}/> Logout
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
            </div>
          </>
        :
          <div />
        }
        <ThemeToggle />
      </Menubar>
  )
};

export default MainMenu;
