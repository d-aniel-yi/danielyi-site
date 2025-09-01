import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dear Reader — Letter",
  description: "A thoughtfully designed letter template for a concise, compelling cover letter.",
};

export default function LetterPage() {

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="display-serif text-4xl tracking-[-0.01em]">&ldquo;Dear Reader&rdquo;</h1>
          <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl"> 
          A letter from the heart to tell you more about me.
          </p>
        </div>
       
    
      </header>

      <article className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/15 p-6 md:p-8">
        <div className="text-sm text-black/60 dark:text-white/60">Last Revised: 08/31/2025</div>

        

        <div className="mt-6 leading-relaxed text-[15px] md:text-[16px]">
          <p>Dear Reader,</p>

          <p className="mt-4">
            If you are reading this, my best guess is that you are one of the following: a curious cat like me, part of a hiring team evaluating new talent, or a potential collaborator. Thank you for taking the time to read this letter and take a look around the site. I hope that it gives you a little sense of who I am.
          </p>

          <p className="mt-4">
            &ldquo;Why biology?&rdquo; is a question that I get often, and the answer is simply that I do not know why I chose biology as my major. I was a kid with an underdeveloped pre-frontal cortex, and had foresight into what my degree would lead to. Before I had my heart set on coaching football, I thought I could be a doctor, a physical therapist, or &ldquo;Whatever, the degree doesn&rsquo;t even matter.&rdquo;
          </p>
          <p className="mt-4">
            Clearly, I didn&rsquo;t do any of those, and instead I landed in a career in sales. I always say that the best sales training I&rsquo;ve ever gotten was tutoring. &ldquo;If you can convince a kid to spend the time to learn math, you can convince an adult to buy&rdquo; is the elevator pitch, but in reality, it&rsquo;s so, so much more. To be a great tutor, you have to be a great listener. You have to care about what each student is struggling with, uncover the deeper gaps in their knowledge, and present solutions in a way that resonates with them. You can&rsquo;t simply possess the answers to their problems - the students have to understand why it&rsquo;s important.
          </p>
          <p className="mt-4">
          I feel the same way about sales - having the right solution in front of the right person is only half the battle. Uncovering their pain points, what their needs truly are (below the surface level), and understanding their &ldquo;why&rdquo; is absolutely key. I think what makes me a great seller is that I&rsquo;m a great listener. If you can truly, truly listen, everything else falls into place.
          </p>      
          <p className="mt-4">
          Sales is a bumpy road, and I&rsquo;ve been fortunate enough to have had a great career so far. I&rsquo;ve worked with all kinds of wonderful people, learned from some incredible mentors, and have made lifelong friends at work, but it hasn&rsquo;t been all sunshine and rainbows. This isn&rsquo;t the place where I talk about the discipline and grit it takes to be a successful salesperson, this is where I stay true to why I created this in the first place: to have a place to be authentic. I&rsquo;ve worked for incredible organizations and incredibly disorganized ones. I&rsquo;ve had amazing managers and ones that gave me nothing but nightmares and anxiety. It would be an absolute lie to say that I haven&rsquo;t spent countless nights wondering why I ended up in this career path, but it has led me to where I am today, and I&rsquo;m grateful for all of the great experiences I&rsquo;ve had, and try daily to find gratitude in the negative experiences as well.
          </p>

          <p className="mt-4">
            Currently, I&rsquo;m one of the Co-Founders of Mobi Measure, a software built for the semiconductor industry, making image metrology more efficient. Sales is one of the many hats that I wear in this incredibly scary, yet fulfilling journey that I&rsquo;ve embarked on. My goal is to make software that an end-user can use every single day and to not be frustrated by it. It&rsquo;s surprisingly a high bar to reach, but every day is dedicated to making that dream a reality.
          </p>

          <p className="mt-4">
            If you&rsquo;re a hiring manager reading this and evaluating whether or not bringing me back to a sales role would be a good fit, I have one challenge for you: find an AE that looks like me. There are a million AE&rsquo;s with a resume like mine, but I think you&rsquo;d be hard pressed to find someone with sales experience who even would want to build this kind of a website. If that sort of skillset and curiosity is of interest to you, I would love to chat.
          </p>

          <p className="mt-4">
            If you&rsquo;re someone who is looking to work with me, partner with me, and/or invest in something I&rsquo;m working on, I genuinely hope that this gives you some insight into how I operate. One of my core principles is to just be genuine, honest, and lead with kindness. I pride myself on being a great listener, and I hope that I&rsquo;m able to live up to that expectation.
          </p>

          <p className="mt-4">
            Regardless of you who are or what you do, I genuinely appreciate you taking the time to read this letter. If there&rsquo;s anything I can do for you, feel free to drop me a line.
          </p>
          <p className="mt-4">Cheers,</p>

          <div className="mt-6">
            <div className="font-medium tracking-[-0.01em]">Daniel Yi</div>
            <div className="text-black/60 dark:text-white/60 text-sm">d@nielyi.com • da.nielyi.com</div>
          </div>
        </div>
      </article>
    </div>
  );
}

