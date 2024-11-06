import { Menubar,
         MenubarContent,
         MenubarItem,
         MenubarMenu,         
         MenubarSeparator,
         MenubarTrigger,
         MenubarSub,
         MenubarSubTrigger,
         MenubarSubContent } from '@/components/ui/menubar';
import { ThemeToggle } from './theme-toggle';
import { BarChart2Icon, BoxIcon, ClipboardIcon, DollarSignIcon, FileTextIcon, LogOutIcon, ShieldIcon, UsersIcon } from 'lucide-react';

const MainMenu = () => {
  return (
    <div className="flex flex-row justify-between">
      <Menubar>
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
                <MenubarItem>
                  <ClipboardIcon className="mr-3" size={16}/> Orçamentos
                </MenubarItem>
                <MenubarItem>
                  <ClipboardIcon className="mr-3" size={16}/> O. de compra
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
            <MenubarItem>
              <LogOutIcon className="mr-3" size={16}/> Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <ThemeToggle />
    </div>
  )
};

export default MainMenu;
