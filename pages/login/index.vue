<template>
  <div class="md-layout md-alignment-center-center" style="height: 100vh">
    <md-card class="md-layout-item md-medium-size-50 md-large-size-50 md-xlarge-size-50">
      <md-card-header>
        <div class="md-title">Login</div>
      </md-card-header>
      <form @submit.prevent="validateForm">
        <md-card-content>
          <md-field md-clearable :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              :disabled="loading"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
            />
            <span class="md-error" v-if="!$v.form.email.required">Email is required.</span>
            <span class="md-error" v-else-if="!$v.form.email.email">Email format is not valid.</span>
          </md-field>
          <md-field md-clearable :class="getValidationClass('password')">
            <label for="password">Password</label>
            <md-input
              :disabled="loading"
              type="password"
              name="password"
              id="password"
              autocomplete="password"
              v-model="form.password"
            />
            <span class="md-error" v-if="!$v.form.password.required">Password is required.</span>
            <span class="md-error" v-else-if="!$v.form.password.minLength">Password must be at least 6 characters.</span>
            <span class="md-error" v-else-if="!$v.form.password.maxLength">Password must be less than 21 characters.</span>
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button to="/register">Go to Register</md-button>
          <md-button class="md-primary md-raised" type="submimt" :disabled="loading">Submit</md-button>
        </md-card-actions>
      </form>
      <md-snackbar :md-active.sync="isAuthenticated">{{form.email}} was successfully logged in!</md-snackbar>
    </md-card>
    <!-- Back Button -->
    <md-button class="md-fab md-fab-bottom-right md-fixed md-primary" @click="$router.go(-1)">
      <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  middleware: 'auth',
  mixins: [validationMixin],
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isAuthenticated(value) {
      if(value) {
        setTimeout(() => this.$router.push('/'), 2000)
      }
    }
  },
  methods: {
    validateForm() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        this.loginUser()
      }
    },
    async loginUser() {
      await this.$store.dispatch('authenticateUser', {
        action: 'login',
        email: this.form.email,
        password: this.form.password,
        returnSecureToken: true
      })
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>