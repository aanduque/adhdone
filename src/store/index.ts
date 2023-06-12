import { createStore } from "vuex";
import { mutations } from "./mutations";
import actions from "./actions";
import plugins from "./plugins";
import { defaultSettings } from "@/data/defaultSettings";
import { flatten } from "lodash";
import { getView } from "@/app";

const getters = {
  /**
   * Compute the total number of tasks
   */
  totalTasks(state) {
    return flatten(
      state.groups
        .filter((group) => !group.ignore)
        .map((group) => group.tasks.active)
    ).filter((task) => !task.canceled).length;
  },

  completedTasks(state) {
    return flatten(
      state.groups
        .filter((group) => !group.ignore)
        .map((group) => group.tasks.active)
    ).filter((task) => task.done).length;
  },

  visibleGroups(state) {

    const filter = getView(state.currentView).filter;

    return state.groups.filter(filter);

  },

  remainingSkips(state) {
    return (
      (state.settings.maxSkips ?? 3) -
      flatten(
        state.groups
          .filter((group) => !group.ignore)
          .map((group) => group.tasks.active)
      ).filter((task) => task.jumped).length
    );
  }
}

export default createStore({
  state: {
    currentView: "groups",
    history: [],
    pageTitle: "Sábado, 10 de junho de 2023",
    lastCategory: "development",
    categories: [
      {
        "name": "General",
        "color": "#e51f75"
      },
      {
        "name": "Personal",
        "color": "#16a085"
      },
      {
        "name": "Development",
        "color": "#2980b9"
      },
      {
        "name": "Daily",
        "color": "#0d1d45"
      },
      {
        "name": "Suporte",
        "color": "#f934c4"
      },
      {
        "name": "Administrativo",
        "color": "#0aa1ff"
      },
      {
        "name": "Chore",
        "color": "#dde010"
      },
      {
        "name": "Review",
        "color": "#76eaa2"
      }
    ],
    groups: [
      {
        "id": "050GV2UpUMeHX8jb3Xs3",
        "name": "☀️ Acorda, menino!",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "lqwiSasF8Y3AyTMeG6gO",
              "done": true,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "😴 Marcar hora em que acordou (06:30)",
              "description": ""
            },
            {
              "id": "01MhFFY7Cj4lHD035d0Q",
              "done": true,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "💊 Tomar remédios",
              "description": ""
            },
            {
              "id": "a38RLJ30Q4fnQi4PEv5w",
              "done": true,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "💧 Beber uma garrafa de água",
              "description": "",
              "canceled": false
            },
            {
              "id": "Kg6xn7AOdEo28WYrC1O1",
              "done": true,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "😃 Controle de humor da manhã - 🥱",
              "description": "",
              "canceled": false
            },
            {
              "id": "aM0D1007h51AQ6poGAqg",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 4,
              "title": "🙆🏻 Fazer 5 minutos de alongamento",
              "description": "",
              "canceled": false
            },
            {
              "id": "Qo5EjAW41s6I6jSUqAcN",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "🏡 Geralzinha na casinha",
              "description": ""
            },
            {
              "id": "vaXp0txxhyiFQHM3owk6",
              "done": true,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 4,
              "title": "🌤️ Passeio da manhã",
              "description": "",
              "canceled": false
            },
            {
              "id": "J8EUWnywo836Ha2T5BNX",
              "done": false,
              "category": "general",
              "jumped": false,
              "counter": 51,
              "title": "🏁 Planejamento do dia",
              "description": "O planejamento do dia consiste em **definir o que é o 🐸 do dia** e colocá-lo no bloco inicial, bem como separar as demais tarefas entre os blocos principais de trabalho.",
              "recurring": true,
              "canceled": false
            },
            {
              "id": "8D4AQUH22WJx3hteMCxl",
              "done": false,
              "recurring": true,
              "category": "general",
              "jumped": false,
              "counter": 2,
              "title": "👨🏻‍💻 Bloco de 1h30 de trabalho focado",
              "description": "",
              "canceled": false
            },
            {
              "id": "Hdu8b4s5tLcv36C7BK0y",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 5,
              "title": "🍴 Lavar as louças",
              "description": "",
              "canceled": false
            },
            {
              "id": "2u2rX83m0Kueo7iP6qi2",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "🏋️‍♀️ 30 minutos de exercícios",
              "description": "",
              "canceled": false
            },
            {
              "id": "F8tc0743RybV1O71ubjt",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "🛀 Tomar banho",
              "description": ""
            }
          ],
          "backlog": [
            {
              "id": "G4Aim7enW7MOq85NPhUs",
              "done": false,
              "recurring": true,
              "category": "general",
              "jumped": false,
              "counter": 2,
              "title": "🔁 Bloco de revisão",
              "description": "",
              "canceled": false
            }
          ],
          "finished": []
        },
        "description": "Rotina de tarefas do início da manhã para que o dia seja massa!"
      },
      {
        "id": "5Knc6IcNmInlfMN8FskC",
        "name": "🎯 Bloco 1",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "6ff7d2e9-9ec4-4548-bf3c-dee8df9ab5f6",
              "url": "https://linear.app/nextpress/issue/WPU-938/app-builder",
              "title": "App Builder",
              "integration": "linear",
              "integrationAccount": null,
              "description": "Essa tarefa centraliza elementos que precisamos implementar para tirar do papel as funcionalidades de app building que queremos adicionar no Ultimo.\n\nVia de regra, a versão mais atualizada dessas tarefas está localizada no arquivo `.todos` do monorepo, mas de tempos em tempos, vou mover esses elementos para cá também.\n\nVou dividir em blocos bonitinhos para cada objetivo, e tentar dar uma data para cada um desses blocos.\n\n### Demo para o Time\n\n* [X] Formulário de Login\n  * [X] Conectar o formulário dummy que temos ao workflow de login\n  * [X] Implementar a action de login\n  * [X] Implementar o result de redirect\n  * [X] Implementar o bloco de código PHP\n* [ ] Editor de Formulários\n  * [ ] CPT de Formulários\n  * [ ] Blocos-base de Formulário\n    * [ ] Form\n      * [ ] Form Step\n        * [ ] Field Group\n        * [ ] Field Label\n        * [ ] Field Input\n        * [ ] Field Message\n      * [ ] Submit Button\n* [ ] Builder UI\n  * [ ] Context Block: Esse bloco é o responsável por mudar o contexto passado aos blocos-filhos, com base em alguns parâmetros recebidos. Ele é útil porque nos permite também oferecer a possibilidade de criar \"lazy-blocks\", que só são carregados via ajax depois do loading inicial, o que torna o shell do App bastante cacheável.\n  * [ ] Query Blocks: Variations do bloco de query do WordPress que vamos usar para implementar loops de elementos que não necessariamente estão relacionados com custom post types, mas sim com custom models do Ultimo ou da rede.\n    * [ ] Sites: Para o demo, só preciso do Site, que vai servir de proxy para as networks do usuário\n    * [ ] Custom Data Type: Também será necessário um data type chamado License, que será relacionada a networks específicos, e também precisará ser exibido.\n    * [ ] Depois\n      * [ ] Memberships\n      * [ ] Payments\n      * [ ] Notifications\n* [ ] Secrets\n  * [ ] Opção de salvar um secret de maneira encryptada\n  * [ ] UI para criação de secrets\n* [ ] Sistema de Notificações\n  * [ ] Criar notificação\n  * [ ] Exibir notificações\n* [ ] Inclusão do ChatGPT: Como temos aquele serviço que gera um bot usando a documentação do Ultimo e do Laravel, além da do WordPress, seria interessante ter um personal assistant para desenvolvimento utilizando o Ultimo. Ele pode gerar snippets que podem ser incluidos diretamente no bloco de execução do PHP dos nossos Workflows.",
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 2,
              "recurring": true
            },
            {
              "id": "M1cj3tbw77Y4Er8AtBR2",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Perguntar sobre o Goal do dia!",
              "description": ""
            },
            {
              "id": "03IhAdUidobKdQkqV28E",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar campos de controle da hora em que acordou e da hora em que dormiu",
              "description": ""
            },
            {
              "id": "n3nCHylm5smalyLtOdL6",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Opção de esconder um grupo",
              "description": ""
            },
            {
              "id": "XfROH2Ll7T67wSS4mpeO",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar toggle nas tasks que diz se elas devem contar para o total ou não",
              "description": ""
            },
            {
              "id": "HU5x5qpD3jUK0lB1vL1F",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar opção que me permita escrever hooks utilizando código, para poder conectar o Daily com o N8N, por exemplo",
              "description": "Com isso, seria possível, por exemplo, salvar as tarefas do dia como um json em um repositório do github automáticamente, sem o medo de perder nada."
            },
            {
              "id": "FU37tN7Ihr3YXcO5p6uJ",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar campos de controle de humor",
              "description": ""
            },
            {
              "id": "bL7YBqvTm7pKrfMn6S3J",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar suporte à grupos de \"trabalho\", que tem suas tarefas ativas limitadas",
              "description": ""
            },
            {
              "id": "484Gh8lQaAdydl25mrH2",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Marcar tarefa como parte do goal diário",
              "description": ""
            },
            {
              "id": "fD7VH0il5Y4S0Hnwk7qK",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Goal review",
              "description": ""
            },
            {
              "id": "d38s53VPRQ4EgH8tiFWQ",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar uma sintaxe para mudar o tamanho do bloco no Daily",
              "description": ""
            },
            {
              "id": "Je5RfaM82Pjnv7xgV2o4",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar uma opção de quebrar uma tarefa em actionable steps",
              "description": ""
            },
            {
              "id": "416bSJ5o725nnTb68AJ1",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Marcar tarefa como hábito",
              "description": ""
            },
            {
              "id": "IJAA1iAal8d58TCkDVFw",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar grupo obrigatório para um horário",
              "description": "Se um grupo é marcado como obrigatório para um horário, depois do horário marcado, ele vira o grupo \"foco\" e só mostra o resto depois que todas as tarefas dele estão concluídas."
            },
            {
              "id": "XBN0k75k57CfuM8Li1E8",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar um \"modo foco\" nos grupos, que esconda o resto e expanda o grupo atual para o meio da tela",
              "description": ""
            },
            {
              "id": "L2Q4mt50Wl5YqgC4rd3p",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 1,
              "title": "Adicionar funcionalidade ao Daily que o permita ter um action button para o campo de URL e que esse campo de URL suporte templating com dados baseados nos valores da tarefa",
              "description": ""
            },
            {
              "id": "i0A6OAnD7861C06dW7cl",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar suporte para uma nota que será mostrada no dia seguinte!",
              "description": ""
            },
            {
              "id": "815U1y7XyoY6EnVsB7Co",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Opção de trocar para a próxima tarefa com tab, e voltar para a anterior com shift + tab",
              "description": ""
            },
            {
              "id": "60Hih72eF16ePNQrPdss",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Mudar a biblioteca de drag and drop utilizada no Daily",
              "description": ""
            },
            {
              "id": "v5DKQS45v0BD8S5wym6H",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar a gaveta da semana",
              "description": "A gaveta da semana é uma linha de blocos que mostra os próximos dias 7 dias. As tarefas dessa gaveta são jogadas na Inbox quando o dia começa."
            }
          ],
          "backlog": [
            {
              "id": "oJt6TpQ2Pj4gyX1q0qDE",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Organizar melhor a estrutura de arquivos do Blocks WPU-966",
              "description": "",
              "url": "https://linear.app/nextpress/issue/WPU-966",
              "integration": "linear"
            },
            {
              "id": "28cv2sdcR528D2N07a6n",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 4,
              "title": "Plano de metas para o lançamento da funcionalidade",
              "description": ""
            },
            {
              "id": "07v6itKK631GeSmrI05G",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 1,
              "title": "Dar um tapa no código de exportação",
              "description": ""
            },
            {
              "id": "5XaxuJ7007HlvFjioRU0",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Sisteminha simples de notificações",
              "description": ""
            }
          ],
          "finished": []
        },
        "description": "Primeiro bloco focado do dia, com 1h30 de duração. Idealmente, focado em uma única tarefa ou tarefas atreladas ao mesmo objetivo."
      },
      {
        "id": "SkhAVHoFDJ6u3fItA17Q",
        "name": "⚒️ SPM do Arindo",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "CR4Pc7lEm7j2OiPF87ur",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Integração com o Things na Inbox",
              "description": "",
              "canceled": true
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Sociedade pró-melhoramento do bairro de eu mesmo. Grupinho para tarefas destinadas à melhora dos sistemas que me fazem funcionar melhor e mais feliz."
      },
      {
        "id": "7eg8RkHv12465N15hojX",
        "name": "🐸 Eat the Frog",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "01Mm8GMGB75t1F4Do86p",
              "done": false,
              "recurring": true,
              "category": "suporte",
              "jumped": false,
              "counter": 12,
              "title": "Repassar tickets no Chatwoot",
              "description": "",
              "canceled": false
            },
            {
              "id": "oG7XIsu56LtBxH0Q673i",
              "done": false,
              "recurring": true,
              "category": "chore",
              "jumped": false,
              "counter": 5,
              "title": "Geral na Comunidade",
              "description": "",
              "canceled": false
            }
          ],
          "backlog": [
            {
              "id": "8d72bd0e-d164-42fa-82ee-6eca82ece52d",
              "url": "https://linear.app/nextpress/issue/DIR-1829/responder-a-discussao-que-eu-mesmo-propus-na-comunidade",
              "title": "Responder a discussão que eu mesmo propus na Comunidade",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "chore",
              "done": false,
              "jumped": false,
              "counter": 1,
              "recurring": false,
              "canceled": false
            },
            {
              "id": "f941bdb8-6810-4c7f-802a-910b5ab86a46",
              "url": "https://linear.app/nextpress/issue/DIR-1828/considerar-mover-o-delta-para-o-aws",
              "title": "Considerar mover o Delta para o AWS",
              "integration": "linear",
              "integrationAccount": null,
              "description": "Temos que fazer uma análise de custo benefício para ver se valeria a pena, realmente, já que poderia dar bastante trabalho.",
              "category": "chore",
              "done": false,
              "jumped": false,
              "counter": 2,
              "recurring": false
            },
            {
              "id": "lC21s8voR6Ao7vfFXBdi",
              "done": false,
              "recurring": false,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "Listar tudo que precisa ser migrado para o AWS para que o processo possa ser encerrado e os droplets do Digital Ocean sejam destruídos",
              "description": ""
            }
          ],
          "finished": []
        },
        "description": "Sabemos que dói, mas temos que sempre começar com o pior, para que o dia possa melhorar dai pra frente."
      },
      {
        "id": "x131rJjraIhvTvf4shpL",
        "name": "✨ Urgentes",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [],
          "finished": []
        },
        "description": "Primeiro bloco de 30 minutos, onde tarefas consideradas urgentes vão ser realizadas primeiro. Entre 10:30-11:00"
      },
      {
        "id": "15RRj1kyPiyUa46T6Xnd",
        "name": "🏃 Chores",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "6FJnn5XhdXmYL2egBmI2",
              "done": false,
              "recurring": true,
              "category": "administrativo",
              "jumped": false,
              "counter": 0,
              "title": "Listar o plano de ação de para o time",
              "description": ""
            }
          ],
          "backlog": [
            {
              "id": "4ji0Q12ot1WOw73Xvc54",
              "done": false,
              "recurring": false,
              "category": "administrativo",
              "jumped": false,
              "counter": 0,
              "title": "Criar demos para todos os produtos no InstaWP",
              "description": ""
            },
            {
              "id": "X2363uFuU6BLw61i4PW1",
              "done": false,
              "recurring": false,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "Listar todos os domínios que tenho - e talvez migrar eles para algum lugar único DIR-1942",
              "description": "",
              "url": "https://linear.app/nextpress/issue/DIR-1942",
              "integration": "linear"
            },
            {
              "id": "CwA7DVyst3lrq44n5fr3",
              "done": false,
              "recurring": false,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "Adicionar o arindoduque.com ao InfiniteWP",
              "description": ""
            },
            {
              "id": "4673c079-bb0d-4a1d-a174-a13e93b7428a",
              "url": "https://linear.app/nextpress/issue/DIR-1881/adicionar-vendas-dos-demais-plugins-a-planilha-de-vendas-tambem",
              "title": "Adicionar vendas dos demais plugins à planilha de vendas também",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "chore",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "X742ma4Y14m43sJ5rXwf",
              "done": false,
              "recurring": false,
              "category": "administrativo",
              "jumped": false,
              "counter": 0,
              "title": "Pensar em como posso delegar os tickets de suporte para o Gustavo",
              "description": ""
            },
            {
              "id": "568a9b03-2f9b-4718-aca1-6c453d77e3eb",
              "url": "https://linear.app/nextpress/issue/DIR-1885/demo-para-a-nicole-dos-workflows",
              "title": "Demo para a Nicole dos Workflows (remarcar)",
              "integration": "linear",
              "integrationAccount": null,
              "description": "Link do Ticket no Chatwoot: [https://support.delta.nextpress.co/app/accounts/1/conversations/289](https://support.delta.nextpress.co/app/accounts/1/conversations/289)",
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "a66ce834-d8ea-4461-b7d1-b1228f9a2696",
              "url": "https://linear.app/nextpress/issue/MEU-108/definir-qual-e-o-objetivo-de-grana-antes-de-largar-tudo-e-o-limite-de",
              "title": "Definir qual é o objetivo de grana antes de largar tudo e o limite de tempo",
              "integration": "linear",
              "integrationAccount": null,
              "description": "Ideia inicial: até o dia 31/12 do ano em que eu tenha 30 anos.",
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "54caa2e5-1793-42a1-a34e-f963ff65b89c",
              "url": "https://linear.app/nextpress/issue/MEU-48/viral-do-chatgpt",
              "title": "Viral do ChatGPT",
              "integration": "linear",
              "integrationAccount": null,
              "description": "",
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            }
          ],
          "finished": []
        },
        "description": "Bloco de 1h30~2h00 para realizar algumas tarefas manuais. Entre 13:30-14:30."
      },
      {
        "id": "AoQwrgziEAQDIHsB2BzaQ",
        "name": "🏡 Tarefas domésticas",
        "tasks": {
          "active": [],
          "finished": [],
          "backlog": []
        },
        "ignore": true,
        "description": "Tarefas para a manutenção de um lar agradável. Entre 14:30 e a hora do almoço."
      },
      {
        "id": "CjJIeHvnO3f80AG113E2",
        "name": "🏃 Exercícios",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [
            {
              "id": "6NKRFBmC34Ofx6lUS2sF",
              "done": false,
              "recurring": false,
              "category": "personal",
              "jumped": false,
              "counter": 0,
              "title": "Implementar a rotina matinal do Andrew Huberman",
              "description": ""
            }
          ],
          "finished": []
        },
        "description": "Lista de exercícios físicos."
      },
      {
        "id": "h64cBB68pQa6x4jX2uh7",
        "name": "Vily, the 🐕",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "qieyJB2S621tLQYMeR11",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 1,
              "title": "🦴 Treino de ansiedade de comida",
              "description": "",
              "canceled": false
            },
            {
              "id": "0p2Evkf7rEwL1Xi72e13",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 1,
              "title": "🌙 Passeio da noite",
              "description": ""
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Tarefas relacionadas com o treinamento do Vily."
      },
      {
        "id": "Ga1HCcwRyxs3oEI6l04B",
        "name": "☕️ A tarde é sua",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "4E48dGU708KMBT44UE7W",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 2,
              "title": "Beber uma garrafa de água",
              "description": ""
            },
            {
              "id": "ARMrLdxr3DGx1C6y2v5B",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 1,
              "title": "Controle de humor da tarde (😴)",
              "description": ""
            },
            {
              "id": "132Ycj7bx4VsdgmDJI8I",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 1,
              "title": "Escrever uma nota sobre como foi a manhã e o que pode melhorar para a tarde",
              "description": "",
              "canceled": false
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Rotinas de tarefas para recomeçar depois do almoço."
      },
      {
        "id": "0UhjRwEGIbOX04ovno65",
        "name": "🌙 Deu por hoje",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "5MnV34vc167qCH1XRRPK",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 0,
              "title": "Beber uma garrafa de água",
              "description": ""
            },
            {
              "id": "5AQhwVbKJ76ORehLkhPY",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 0,
              "title": "Revisar os hábitos marcados no Streaks",
              "description": "",
              "canceled": false
            },
            {
              "id": "m15eW7vUyub7362KT3bW",
              "done": false,
              "recurring": true,
              "category": "general",
              "jumped": false,
              "counter": 0,
              "title": "Revisar o calendário para eventos que precisam estar no radar",
              "description": "",
              "canceled": false
            },
            {
              "id": "1SHqD850lVW3X50y7FRG",
              "done": false,
              "recurring": true,
              "category": "general",
              "jumped": false,
              "counter": 0,
              "title": "Revisar os blocos do session e as notas deixadas",
              "description": "",
              "canceled": false
            },
            {
              "id": "PMP1L08yA7v8vwAR21LM",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 2,
              "title": "Marcar a hora em que parou",
              "description": "",
              "canceled": false
            },
            {
              "id": "OjBB0R8B723x1ckQ1igB",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 0,
              "title": "Controle de humor da noite",
              "description": "",
              "canceled": false
            },
            {
              "id": "1T8ijn54s4ys0IaJr8Ni",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 0,
              "title": "Um recado para o eu de amanhã!",
              "description": "",
              "canceled": false
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Rotina final do dia, com foco em review, gratidão e o dia de amanhã."
      },
      {
        "id": "EoUwxg9gTlIHYBcQGcg",
        "name": "🔁 Bloco de revisão",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "02df4Bg6XL7Np833XNXE",
              "done": false,
              "recurring": true,
              "category": "chore",
              "jumped": false,
              "counter": 13,
              "title": "Review das issues no Linear",
              "description": "",
              "canceled": false
            },
            {
              "id": "nBt25k555TJRCK8vhWy1",
              "done": false,
              "recurring": true,
              "category": "chore",
              "jumped": false,
              "counter": 2,
              "title": "Review de notificações no Github",
              "description": "",
              "canceled": false
            },
            {
              "id": "0wellkbS5b0H0HOA3mp4",
              "done": false,
              "category": "chore",
              "jumped": false,
              "counter": 33,
              "title": "Inbox Zero",
              "description": "",
              "recurring": true,
              "canceled": false
            },
            {
              "id": "BasEw7RTQFg4EP22FvFB",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 0,
              "title": "Revisar o WhatsApp",
              "description": "",
              "canceled": false
            }
          ],
          "finished": [],
          "backlog": []
        },
        "description": "Tarefas recorrentes, que rolam todo dia."
      },
      {
        "id": "731hBji6kME8Ip4afIpV",
        "name": "📥 Inbox",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [
            {
              "id": "2eieQi45AQ0n4AKQ71AU",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Ver conta e integração com o i20",
              "description": ""
            }
          ],
          "finished": []
        },
        "description": "Tarefas que descobri e precisam ser distribuidas"
      },
      {
        "id": "Kgy2rN6o4N3Ua2p03p46",
        "name": "⚽️ Bate-bola, jogo rápido",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "658h01MYpkyyf5kCl53D",
              "done": true,
              "recurring": false,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "Colocar o Dropbox para rodar de madrugada e criar lembretes para fazer backups da time machine recorrentemente",
              "description": "",
              "canceled": false
            }
          ],
          "backlog": [
            {
              "id": "tu3n1GlQ8xTX6PWuJ1YO",
              "done": false,
              "recurring": true,
              "category": "general",
              "jumped": false,
              "counter": 0,
              "title": "Pedir refund Neil Patel",
              "description": "",
              "canceled": true
            }
          ],
          "finished": []
        },
        "description": "Tarefinhas que podem ser realizadas em 5min ou menos."
      },
      {
        "id": "18rEBJ7pHRvlrrJ6NcnL",
        "name": "🥾 Encaminhamentos",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [],
          "finished": []
        },
        "description": "Tarefinhas que precisam ser desenvolvidas hoje."
      },
      {
        "id": "681eXEXR7e4k4D3IPauH",
        "name": "👨🏻‍💻 Desenvolvimento",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [
            {
              "id": "R11E6pRh8nP26uB0M8Tu",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Fix do Freemius SDK não funciona se outro plugin adiciona o SDK também WPU-662",
              "description": "",
              "url": "https://linear.app/nextpress/issue/WPU-662",
              "integration": "linear"
            }
          ],
          "finished": []
        },
        "description": "Tarefas relacionadas à programação."
      },
      {
        "id": "0YWQFiRXgmcXf54rb7XI",
        "name": "🏢 Busca de emprego",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [
            {
              "id": "d80aa0a8-a051-4c85-aa42-9519aa2ae671",
              "url": "https://linear.app/nextpress/issue/MEU-59/adicionar-fotos-dos-eventos-da-comunidade-de-wordpress-de-juiz-de-fora",
              "title": "Adicionar fotos dos eventos da Comunidade de WordPress de Juiz de Fora (talvez fazer o back-dating?)",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "b1047782-f633-47a6-b06d-715662a7440a",
              "url": "https://linear.app/nextpress/issue/MEU-61/escrever-cover-letters-para-cada-vaga",
              "title": "Escrever cover letters para cada vaga",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 1
            },
            {
              "id": "2c73d3f7-c64c-4b5e-b3bf-5364c2686448",
              "url": "https://linear.app/nextpress/issue/MEU-53/atualizar-meu-site-pessoal-para-me-certificar-de-que-ele-tem-tudo-que",
              "title": "Atualizar meu site pessoal para me certificar de que ele tem tudo que precisa ter",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "2080cc93-571c-4e61-9b38-00edc7a33f2a",
              "url": "https://linear.app/nextpress/issue/MEU-55/buscar-referencias-de-coisas-legais-para-incluir-baseado-no-site-do",
              "title": "Buscar referências de coisas legais para incluir, baseado no site do Felipe",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 1
            },
            {
              "id": "91eb9f06-ceab-400c-89a7-57cc4e50cf15",
              "url": "https://linear.app/nextpress/issue/NEX-421/post-sobre-experimentos-com-o-chatgpt-dando-a-entender-que-algo-como-o",
              "title": "Post sobre experimentos com o ChatGPT, dando a entender que algo como o Viral descrito aqui está por vir",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "78f4191c-f75f-4229-8262-df74188f3857",
              "url": "https://linear.app/nextpress/issue/MEU-60/copiar-os-formularios-de-aplicacao-para-que-possa-responde-los-aqui-no",
              "title": "Copiar os formulários de aplicação para que possa respondê-los aqui no Linear",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            }
          ],
          "finished": []
        },
        "description": "Tarefas relacionadas à busca de empregos."
      },
      {
        "id": "lm2oB5486wP00x845jA4",
        "name": "📢 Marketing e SEO",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "0c31b1e9-ff58-4c3b-8c99-d84671679ba3",
              "url": "https://linear.app/nextpress/issue/NEX-432/pesquisa-de-que-keywords-devemos-mirar",
              "title": "Pesquisa de que keywords devemos mirar",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "f07baed5-4192-4f10-8c63-0fe263c290ab",
              "url": "https://linear.app/nextpress/issue/NEX-459/crash-course-de-seo-para-beginners",
              "title": "Crash course de SEO para beginners",
              "integration": "linear",
              "integrationAccount": null,
              "description": "* [ ] [SEO Crash Course | Beginners and Experts Welcome](https://www.keysearch.co/tutorials/seo-crash-course)",
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "a391da51-279a-4517-b464-22a5139e188b",
              "url": "https://linear.app/nextpress/issue/NEX-428/curso-de-seo-para-developers",
              "title": "Curso de SEO para developers",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "1545c5ee-e444-4fcb-8902-256e2afa31f4",
              "url": "https://linear.app/nextpress/issue/NEX-423/email-sequencies",
              "title": "Email sequencies",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "4d206d75-c9c4-4892-ab3f-c82a957a5dd9",
              "url": "https://linear.app/nextpress/issue/NEX-427/pesquisar-como-fazer-uma-boa-segmentacao-da-minha-lista",
              "title": "Pesquisar como fazer uma boa segmentação da minha lista",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 1
            },
            {
              "id": "0a21afed-21a0-451b-8f21-aed42c5ef923",
              "url": "https://linear.app/nextpress/issue/NEX-436/calendario-de-publicacoes-de-postagens-com-base-nas-keywords",
              "title": "Calendário de publicações de postagens, com base nas keywords",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "0631bfb9-6362-4f1c-bbdf-17956ec61743",
              "url": "https://linear.app/nextpress/issue/NEX-435/plano-para-acompanhar-as-keywords-escolhidas-ao-longo-do-tempo",
              "title": "Plano para acompanhar as keywords escolhidas ao longo do tempo",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "b0fcb567-8b04-467f-ae24-10a0550005c5",
              "url": "https://linear.app/nextpress/issue/NEX-434/adicionar-meta-data-para-seo-em-todas-as-postagens-existentes",
              "title": "Adicionar meta data para SEO em todas as postagens existentes",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "9e1543a4-e2fc-4b87-a8c5-eca7a29191cb",
              "url": "https://linear.app/nextpress/issue/NEX-424/pessoas-que-entram-no-demo",
              "title": "Pessoas que entram no demo",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "9723bd14-ecf8-4b25-80dd-8c5f5dcc2916",
              "url": "https://linear.app/nextpress/issue/WPU-971/revisao-das-perguntas-da-survey-de-2023",
              "title": "Revisão das perguntas da Survey de 2023",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "development",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "d99e015a-8181-4934-87ab-eb5d8643f604",
              "url": "https://linear.app/nextpress/issue/NEX-441/explicar-o-que-e-uma-network-idealmente-com-conteudo-em-video",
              "title": "Explicar o que é uma Network, idealmente com conteúdo em vídeo",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 0
            }
          ],
          "backlog": [
            {
              "id": "h3p1y13PdlV2cvOVK8Nh",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "https://gridpane.com/kb/using-wp-ultimo-with-gridpane/",
              "description": ""
            },
            {
              "id": "x0PuswlJxRxrYnfq1IVI",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "https://www.trustpilot.com/review/wpultimo.com",
              "description": ""
            }
          ],
          "finished": []
        },
        "description": "Tarefas de marketing para o produto."
      },
      {
        "id": "6O4H15Yiji4SLNg7WV5x",
        "name": "👊🏼 Para delegar",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "Usl7IdHUS82nA52385Ss",
              "done": false,
              "recurring": false,
              "category": "general",
              "jumped": false,
              "counter": 0,
              "title": "Atualizar o Roadmap",
              "description": ""
            },
            {
              "id": "c5353d6e-77aa-4c69-b93d-49c529b33cf5",
              "url": "https://linear.app/nextpress/issue/NEX-433/ajustes-nas-postagens-existentes-para-que-o-ranking-seja-melhor-para",
              "title": "Ajustes nas postagens existentes, para que o ranking seja melhor para as keywords que selecionamos",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "bb141f0a-8409-491a-a1b8-372466b2da83",
              "url": "https://linear.app/nextpress/issue/NEX-444/substituir-o-site-do-nextpress-por-uma-tela-de-espera",
              "title": "Substituir o site do NextPress por uma tela de espera",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 0
            },
            {
              "id": "7cac2604-22f3-4dbb-b38c-3ec357dfc33a",
              "url": "https://linear.app/nextpress/issue/NEX-438/mover-os-posts-do-antigo-roadmap",
              "title": "Mover os posts do antigo roadmap",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 0
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Tarefas para descrever e passar para terceiros."
      },
      {
        "id": "2y6Y85jpN3Y0eos71bfh",
        "name": "🙏 Delegadas",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "5A2SS6YPVv8tSl1PuxWh",
              "done": false,
              "recurring": true,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "Tickets do Tyler para revisar (WPU-926, WPU-904, CW-497)",
              "description": "Pedir um resumo do Lucas sobre a situação sobre esses tickets.",
              "url": "https://support.delta.nextpress.co/app/accounts/1/conversations/497",
              "integration": "chatwoot"
            },
            {
              "id": "wd86Gu6Y3N8h1g02OnNS",
              "done": false,
              "recurring": true,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "Merge na branch da 2.1.1 do Ultimo",
              "description": ""
            },
            {
              "id": "e8e675a1-5a90-4892-bd28-bbc91144a133",
              "url": "https://linear.app/nextpress/issue/NEX-447/criar-template-de-checklist-para-o-lancamento-de-uma-nova-versao",
              "title": "Criar template de checklist para o lançamento de uma nova versão",
              "integration": "linear",
              "integrationAccount": null,
              "description": "O processo de lançamento de uma nova versão é bastante repetitivo e quase sempre envolve os mesmos passos. Com base nisso, o ideal é termos um template que possamos  utilizar sempre que uma nova versão precisar ser lançada.",
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 0,
              "recurring": true
            },
            {
              "id": "902c12f7-1407-4e77-afda-06ce07deca3b",
              "url": "https://linear.app/nextpress/issue/NEX-442/pagina-de-changelog-atualizar-para-a-nova-versao",
              "title": "Página de Changelog - atualizar para a nova versão",
              "integration": "linear",
              "integrationAccount": null,
              "description": null,
              "category": "general",
              "done": false,
              "jumped": false,
              "counter": 1,
              "recurring": true
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Lista para o acompanhamento das tarefas delegadas."
      },
      {
        "id": "oUOs0Lv7kYH21O4MM6du",
        "name": "📡 No Radar",
        "ignore": true,
        "tasks": {
          "active": [],
          "backlog": [],
          "finished": []
        },
        "description": "Coisas que não são para agora, mas precisam estar no radar."
      },
      {
        "id": "inn173UbbM4I7pB1c0Y2",
        "name": "😄 Pessoal",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "0UO37741BGRV7U18NrWE",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 3,
              "title": "🥁 Tocar Bateria",
              "description": "",
              "canceled": false
            }
          ],
          "backlog": [
            {
              "id": "hr4vSOIH5dqCdhCQiauv",
              "done": false,
              "recurring": false,
              "category": "personal",
              "jumped": false,
              "counter": 1,
              "title": "Organizar o Streaks com os hábitos corretos",
              "description": ""
            }
          ],
          "finished": []
        },
        "description": "Lista de tarefas pessoais."
      },
      {
        "id": "XGQ7S747W1qb545n082A",
        "name": "🌤️ Depois de comer",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "RmdiGVu5xB1FGO1gpGT7",
              "done": false,
              "recurring": true,
              "category": "chore",
              "jumped": false,
              "counter": 0,
              "title": "⌨️ Monkeytype?",
              "description": ""
            }
          ],
          "backlog": [
            {
              "id": "a1G2yij6026q5Xwo0n82",
              "done": false,
              "recurring": false,
              "category": "administrativo",
              "jumped": false,
              "counter": 0,
              "title": "Ver o lance do contrato do Trampos",
              "description": "",
              "canceled": true
            }
          ],
          "finished": []
        },
        "description": "Tarefas mais \"leves\", para fazer durante a digestão. Bloco de entre 30min e 1h."
      },
      {
        "id": "5ei27L0lA05cXtrHP337",
        "name": "💤 Antes de dormir",
        "ignore": false,
        "tasks": {
          "active": [
            {
              "id": "25il6rQEh0uI4FsC45Ih",
              "done": false,
              "recurring": true,
              "category": "personal",
              "jumped": false,
              "counter": 6,
              "title": "☀️ Passeio da tarde",
              "description": "",
              "canceled": false
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Tarefinhas mais leves, para fechar o dia e ir dormir."
      },
      {
        "id": "144rJ5I7O1K8b8W13piV",
        "name": "🚀 Bloco 2",
        "ignore": true,
        "tasks": {
          "active": [
            {
              "id": "C7LC7584uXCW8DTx87bJ",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 2,
              "title": "Invoice App - Saving the contents of the inputs on the models",
              "description": ""
            },
            {
              "id": "3dBh0las86p6e86Ry0Pe",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Invoice App - Register the model classes for the new types",
              "description": ""
            },
            {
              "id": "0uYdT2Wp5X07IL8mX1iT",
              "done": false,
              "recurring": false,
              "category": "development",
              "jumped": false,
              "counter": 0,
              "title": "Invoice App - Adding validation to the inputs before saving, using Form Requests",
              "description": ""
            },
            {
              "id": "W23oySdkiuV415MOR5ll",
              "done": false,
              "recurring": true,
              "category": "development",
              "jumped": false,
              "counter": 5,
              "title": "Invoice App - Attributes Engine",
              "description": ""
            }
          ],
          "backlog": [],
          "finished": []
        },
        "description": "Segundo bloco focado do dia, com 2:00 de duração. Idealmente, focado em uma única tarefa ou tarefas atreladas ao mesmo objetivo. Feito na tarde."
      }
    ],
    inbox: {
      name: "📥 Inbox",
      description: "Tarefas que ainda não foram categorizadas.",
      tasks: [
        {
          "id": "lqwiSasF8Y3AyTMeG6gO",
          "done": true,
          "recurring": true,
          "category": "personal",
          "jumped": false,
          "counter": 3,
          "title": "😴 Marcar hora em que acordou (06:30)",
          "description": ""
        },
        {
          "id": "01MhFFY7Cj4lHD035d0Q",
          "done": true,
          "recurring": true,
          "category": "personal",
          "jumped": false,
          "counter": 3,
          "title": "💊 Tomar remédios",
          "description": ""
        },
      ]
    },
    settings: defaultSettings,
    hoveredGroup: null,
    hoveredTask: null,
    currentTask: null,
    currentSession: null,
    expandedActiveTaskBar: false,
    sessions: null,
    lastSync: null,
    hash: null,
  },
  getters,
  actions,
  mutations,
  plugins,
});
