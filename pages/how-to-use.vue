<template>
  <div class="page-container -how-to-use">
    <section class="how-to-use">
      <PageBackButton />

      <v-row class="content mt-5">
        <v-col>
          <h2>このアプリの使い方</h2>
          <p>
            Clipper(クリッパー)は、簡単ログインで気軽に自分だけのお気に入り画像を保存しておけるギャラリーアプリです。<br>
            自分の描いたイラストや写真などの作品画像をアップロードして小さなWeb個展のようにしたり、ネットで見つけた画像をまとめておく場所にしたり、様々な目的で使えます。
          </p>
        </v-col>
      </v-row>
      <v-row class="content mt-5 mt-sm-6 mt-md-8 mt-lg-8 mt-xl-8">
        <v-col>
          <h3>Clipper(クリッパー)の開発経緯と開発者について</h3>
          <p>
            Clipperは、イラストを描くのが趣味のsatoが開発しているWebアプリです&#128578;<br>
            自分の描いた絵をWeb上でまとめて見ることができて、誰かへの共有も簡単にできるようなものがあればな...と思って作りました。<br>
            既存サービス(SNSなど)で作品公開するよりも、もう少しプライベートに作品共有ができるようなギャラリーアプリを目指して、今後もアップデートしていく予定です。
          </p>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.how-to-use {
  margin: 20px auto 0;
  max-width: 880px;

  @media (--sp) {
    margin: 12x auto 0;
    max-width: 100%;
  }

  & .content {
    background-color: rgba(97,171,155, .08);
    border: 2px solid var(--color-accent);
    border-radius: 16px;
    margin-top: 20px;
    padding: 20px 32px;
    margin: auto;
    width: 100%;

    @media (--sp) {
      margin-top: 12px;
      padding: 12px 16px;
    }

    & h2,
    & h3 {
      margin-bottom: 12px;
      padding-left: 20px;
      position: relative;

      @media (--sp) {
        padding-left: 16px;
      }

      &::before {
        content: '';
        display: block;
        background-color: var(--color-accent);
        margin: auto 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        height: 70%;
        width: 4px;
      }
    }

    & h2 {
      letter-spacing: .08em;
      line-height: 2;
      padding-bottom: 4px;

      @media (--sp) {
        font-size: 20px;
        letter-spacing: .06em;
        line-height: 1.75;
      }
    }

    & h3 {
      letter-spacing: .08em;
      line-height: 2;
      padding-bottom: 4px;

      @media (--sp) {
        font-size: 16px;
        letter-spacing: .06em;
        line-height: 1.75;
      }

      &::before {
        width: 3px;
      }
    }

    & p,
    & li {
      font-size: 14px;
      letter-spacing: .02em;
      line-height: 2;

      @media (--sp) {
        font-size: 12px;
      }
    }
  }
}
</style>