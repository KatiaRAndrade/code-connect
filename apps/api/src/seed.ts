import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Comment } from './posts/comment.entity';
import { Like } from './posts/like.entity';
import { Post } from './posts/post.entity';
import { User } from './users/user.entity';

const USERS = [
  { name: 'Julio Oliveira', email: 'julio@codeconnect.dev', password: 'senha123' },
  { name: 'Ana Silva', email: 'ana@codeconnect.dev', password: 'senha123' },
  { name: 'Carlos Menezes', email: 'carlos@codeconnect.dev', password: 'senha123' },
];

const POSTS = [
  {
    title: 'Construindo uma UI acessível com React e Tailwind',
    description:
      'Explorei as melhores práticas de acessibilidade no React combinando roles ARIA, foco gerenciado e classes Tailwind. O resultado foi um componente de modal totalmente navegável por teclado.',
    thumbnailUrl: 'https://picsum.photos/seed/react-a11y/800/400',
    tags: ['React', 'Tailwind', 'Acessibilidade'],
    authorIndex: 0,
  },
  {
    title: 'TypeScript Generics na prática: criando hooks reutilizáveis',
    description:
      'Generics são um dos recursos mais poderosos do TypeScript. Neste post mostro como criar hooks React altamente reutilizáveis com inferência de tipos automática.',
    thumbnailUrl: 'https://picsum.photos/seed/ts-generics/800/400',
    tags: ['TypeScript', 'React', 'Hooks'],
    authorIndex: 1,
  },
  {
    title: 'NestJS com PostgreSQL: padrões que funcionam em produção',
    description:
      'Depois de migrar três projetos para NestJS + TypeORM, compilei os padrões que mais se repetiram: módulos granulares, guards baseados em roles e queries otimizadas.',
    thumbnailUrl: null,
    tags: ['NestJS', 'PostgreSQL', 'Back-end'],
    authorIndex: 2,
  },
  {
    title: 'CSS Grid vs Flexbox: quando usar cada um',
    description:
      'Uma análise prática de quando Grid resolve melhor que Flexbox e vice-versa, com exemplos reais de layouts que já construí. Spoiler: a maioria dos casos usa os dois juntos.',
    thumbnailUrl: 'https://picsum.photos/seed/css-grid/800/400',
    tags: ['CSS', 'Front-end', 'Layout'],
    authorIndex: 0,
  },
  {
    title: 'Meu setup de testes para aplicações React em 2025',
    description:
      'Vitest + Testing Library + MSW: essa combinação ficou meu padrão de ouro. Explico como configurar cada ferramenta e qual estratégia de testes adoto para componentes, hooks e páginas.',
    thumbnailUrl: 'https://picsum.photos/seed/vitest-setup/800/400',
    tags: ['Testes', 'Vitest', 'React'],
    authorIndex: 1,
  },
  {
    title: 'Animações performáticas com Framer Motion',
    description:
      'Aprendi que animar a propriedade transform em vez de margin/padding faz toda a diferença. Este post mostra como orquestrar animações complexas sem travar o thread principal.',
    thumbnailUrl: null,
    tags: ['Animação', 'Framer Motion', 'React'],
    authorIndex: 2,
  },
  {
    title: 'State management em 2025: Zustand ou Jotai?',
    description:
      'Comparei Zustand e Jotai em um projeto real com 50+ estados globais. Ambas são excelentes mas têm filosofias distintas. Veja qual se encaixa melhor no seu caso.',
    thumbnailUrl: 'https://picsum.photos/seed/state-mgmt/800/400',
    tags: ['React', 'Zustand', 'Jotai', 'State'],
    authorIndex: 0,
  },
  {
    title: 'Docker Compose para desenvolvimento local: o guia definitivo',
    description:
      'Montar um ambiente com Postgres, Redis e a API em segundos usando Docker Compose. Mostro também como usar healthchecks para garantir a ordem de startup dos serviços.',
    thumbnailUrl: 'https://picsum.photos/seed/docker-dev/800/400',
    tags: ['Docker', 'DevOps', 'PostgreSQL'],
    authorIndex: 2,
  },
  {
    title: 'Como estruturei o design system do meu projeto pessoal',
    description:
      'Parti do zero com Tailwind v4 e Figma para criar tokens de cor, tipografia e espaçamento consistentes. A chave foi definir as variáveis antes de criar qualquer componente.',
    thumbnailUrl: null,
    tags: ['Design System', 'Tailwind', 'Figma'],
    authorIndex: 1,
  },
  {
    title: 'Otimizando bundle size com code splitting no Vite',
    description:
      'Reduzi o bundle inicial de 800kb para 180kb usando lazy loading e manual chunks no Vite. Aqui está o processo passo a passo, incluindo a análise com rollup-plugin-visualizer.',
    thumbnailUrl: 'https://picsum.photos/seed/vite-bundle/800/400',
    tags: ['Vite', 'Performance', 'Front-end'],
    authorIndex: 0,
  },
  {
    title: 'JWT na prática: autenticação stateless com NestJS',
    description:
      'Implementei autenticação completa com JWT, refresh tokens e proteção de rotas no NestJS. Este post detalha as decisões de design e os trade-offs de cada abordagem.',
    thumbnailUrl: 'https://picsum.photos/seed/jwt-auth/800/400',
    tags: ['JWT', 'NestJS', 'Segurança'],
    authorIndex: 2,
  },
  {
    title: 'React Query: o fim do useEffect para fetch de dados',
    description:
      'Depois de adotar React Query em todos os projetos, nunca mais escrevi useEffect para buscar dados. Mostro os principais padrões: queries, mutations, invalidação de cache e otimistic updates.',
    thumbnailUrl: null,
    tags: ['React Query', 'React', 'Front-end'],
    authorIndex: 1,
  },
];

const COMMENTS = [
  'Excelente post! Aprendi muito com isso.',
  'Tinha exatamente essa dúvida, obrigado por compartilhar!',
  'Poderia explorar mais a parte de performance?',
  'Uso isso no trabalho há meses, funciona muito bem.',
  'Ótima referência, vou compartilhar com o time.',
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const postRepo = app.get<Repository<Post>>(getRepositoryToken(Post));
  const likeRepo = app.get<Repository<Like>>(getRepositoryToken(Like));
  const commentRepo = app.get<Repository<Comment>>(getRepositoryToken(Comment));

  // Clear existing seed data (only users with @codeconnect.dev email)
  const existingUsers = await userRepo.find({
    where: USERS.map((u) => ({ email: u.email })),
  });
  if (existingUsers.length > 0) {
    const userIds = existingUsers.map((u) => u.id);
    const existingPosts = await postRepo.find({
      where: userIds.map((id) => ({ authorId: id })),
    });
    const postIds = existingPosts.map((p) => p.id);
    if (postIds.length > 0) {
      await commentRepo.createQueryBuilder().delete().where('"postId" IN (:...ids)', { ids: postIds }).execute();
      await likeRepo.createQueryBuilder().delete().where('"postId" IN (:...ids)', { ids: postIds }).execute();
    }
    if (userIds.length > 0) {
      await commentRepo.createQueryBuilder().delete().where('"authorId" IN (:...ids)', { ids: userIds }).execute();
      await likeRepo.createQueryBuilder().delete().where('"userId" IN (:...ids)', { ids: userIds }).execute();
      await postRepo.createQueryBuilder().delete().where('"authorId" IN (:...ids)', { ids: userIds }).execute();
      await userRepo.createQueryBuilder().delete().where('id IN (:...ids)', { ids: userIds }).execute();
    }
  }

  // Create users
  const createdUsers: User[] = [];
  for (const u of USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = userRepo.create({ name: u.name, email: u.email, passwordHash });
    createdUsers.push(await userRepo.save(user));
  }

  // Create posts
  const createdPosts: Post[] = [];
  for (const p of POSTS) {
    const author = createdUsers[p.authorIndex];
    const post = postRepo.create({
      title: p.title,
      description: p.description,
      thumbnailUrl: p.thumbnailUrl,
      tags: p.tags,
      authorId: author.id,
    });
    createdPosts.push(await postRepo.save(post));
  }

  // Add some likes (each user likes roughly half the posts)
  for (let i = 0; i < createdPosts.length; i++) {
    for (let j = 0; j < createdUsers.length; j++) {
      if ((i + j) % 2 === 0) {
        const like = likeRepo.create({
          postId: createdPosts[i].id,
          userId: createdUsers[j].id,
        });
        await likeRepo.save(like).catch(() => {/* skip duplicate */});
      }
    }
  }

  // Add some comments
  for (let i = 0; i < createdPosts.length; i++) {
    const numComments = (i % 3) + 1;
    for (let c = 0; c < numComments; c++) {
      const authorIdx = (i + c) % createdUsers.length;
      const comment = commentRepo.create({
        postId: createdPosts[i].id,
        authorId: createdUsers[authorIdx].id,
        content: COMMENTS[(i + c) % COMMENTS.length],
      });
      await commentRepo.save(comment);
    }
  }

  console.log(`✅ Seed concluído:`);
  console.log(`   ${createdUsers.length} usuários`);
  console.log(`   ${createdPosts.length} posts`);
  console.log(`   Likes e comentários adicionados`);
  console.log(`\nCredenciais de teste: julio@codeconnect.dev / senha123`);

  await app.close();
}

seed().catch((err) => {
  console.error('Seed falhou:', err);
  process.exit(1);
});
