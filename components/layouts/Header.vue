<template>
  <v-app-bar
    app
    fixed
    color="white"
    class="px-3 py-1"
    flat
  >
    <v-spacer></v-spacer>

    <div class="header__user-icon">
      <figure
        v-if="user.image"
        class="icon-image"
      >
        <img :src="user.image" alt="">
      </figure>
      <div
        v-else
        class="icon-image -no-setting"
      >
        <span class="mdi mdi-account-outline"></span>
      </div>
    </div>

    <v-menu
      rounded="lg"
      offset-y
    >
      <template v-slot:activator="{ attrs, on }">
        <div
          v-bind="attrs"
          v-on="on"
          class="d-flex align-center"
        >
          <div class="header__menu-toggle">
            <span class="mdi mdi-chevron-down"></span>
          </div>
        </div>
      </template>
      <v-list class="pt-0 header__menu">
        <div class="pa-4 mb-2 header__menu-greeting">
          <p>
            {{ user.name }}さん、こんにちは！
          </p>
        </div>
        <v-list-item
          v-for="menu in menus"
          :key="menu.id"
          link
          @click="onClickMenu(menu)"
        >
          <v-list-item-title v-text="menu.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },

  setup () {
    const router = useRouter()

    /** Reactive State **/
    const reactiveState = reactive({
      menus: [
        {
          id: 'mypage',
          title: 'マイページ',
          link: 'mypage'
        },
        {
          id: 'logout',
          title: 'ログアウト',
          link: ''
        }
      ]
    })

    /** Methods **/
    const methods = {
      onClickMenu (menu: any) {
        if (menu.id === 'logout') {
          (this as any).$store.dispatch('logout')
        }
        if (menu.link !== '') {
          router.push(`/${ menu.link }/`)
        }
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss">
.header__user-icon {
  & .icon-image {
    border-radius: 50%;
    position: relative;
    height: 40px;
    width: 40px;

    @media (--sp) {
      height: 36px;
      width: 36px;
    }

    &.-no-setting {
      background-color: var(--color-secondary);
    }

    &::after {
      content: '';
      background-color: rgba(117, 117, 117, .1);
      border-radius: 50%;
      display: block;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      transition: all .3s;
      height: 100%;
      width: 100%;
    }

    &:hover::after {
      @media (--not-sp) {
        opacity: 1;
      }
    }

    & .mdi {
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px !important;
      height: 100%;
      width: 100%;

      @media (--sp) {
        font-size: 18px !important;
      }
    }

    & img {
      border-radius: 50%;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
}

.header__menu-toggle {
  margin-left: 12px;

  @media (--sp) {
    margin-left: 8px;
  }

  & .mdi {
    color: var(--color-primary);
    display: block;
    font-size: 32px !important;
    transition: all .15s;

    @media (--sp) {
      font-size: 28px !important;
    }

    &:hover {
      @media (--not-sp) {
        padding-top: 4px;
      }
    }
  }
}

.header__menu {
  & .header__menu-greeting {
    background-color: rgba(97, 171, 155, .2);
    border-bottom: 2px solid var(--color-accent);
    color: var(--color-text-light);
    font-size: 14px;
    font-weight: bold;
    letter-spacing: .06em;

    @media (--sp) {
      font-size: 13px;
    }
  }

  & .v-list-item__title {
    color: var(--color-primary);
    font-size: 15px;
    font-weight: bold;
    letter-spacing: .04em;

    @media (--sp) {
      font-size: 14px;
    }
  }
}
</style>